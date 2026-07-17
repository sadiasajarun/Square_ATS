/* ══════════════════════════════════════════════════════════════════════════
   STLX — minimal, dependency-free writers for real .xlsx and .zip files.

   WHY THIS EXISTS INSTEAD OF SheetJS/JSZip:
   The R12 brief assumed a static prototype cannot produce a true .xlsx without
   a CDN library. It can — this file does it in ~120 lines, and its output has
   been round-trip verified with openpyxl (merged cells, styles, frozen panes,
   column widths, multi-sheet). Using a CDN would have:
     · broken the "pure HTML/CSS/inline-SVG/vanilla-JS — no dependencies, no
       build step" rule that every round of this prototype has held to,
     · added an external network dependency (the prototype currently runs from
       file:// and offline), and
     · been unnecessary.
   Extracted from the verified Round-11 writer in assessment-summary-report so
   there is ONE copy rather than a per-page duplicate that drifts.

   Produces Office Open XML packaged in a STORE-method (uncompressed) ZIP.
   Excel, LibreOffice and Google Sheets all open the result without warnings.

   API
     STLX.write(filename, sheets)   sheets: [{name, rows, widths, merges, freeze}]
     STLX.zip(files)                files:  [{name, data:string}] → Blob
     STLX.save(blob, filename)      triggers a browser download
     STLX.S                         style ids for cells (see below)

   A row is an array of cells. A cell is either a primitive (string/number) or
   {v: value, s: styleId, n: true-if-numeric}.
   ══════════════════════════════════════════════════════════════════════════ */
var STLX=(function(){

  /* ── CRC32 + STORE-method ZIP ─────────────────────────────────────────── */
  var T=(function(){var t=[],c,n,k;for(n=0;n<256;n++){c=n;for(k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
  function crc32(u8){var c=0xFFFFFFFF;for(var i=0;i<u8.length;i++)c=T[(c^u8[i])&0xFF]^(c>>>8);return (c^0xFFFFFFFF)>>>0}

  function zip(files,mime){
    var enc=new TextEncoder(),parts=[],cen=[],off=0;
    files.forEach(function(f){
      var data=typeof f.data==='string'?enc.encode(f.data):f.data;
      var name=enc.encode(f.name),crc=crc32(data);
      var lh=new Uint8Array(30+name.length),dv=new DataView(lh.buffer);
      dv.setUint32(0,0x04034b50,true);dv.setUint16(4,20,true);dv.setUint16(8,0,true);
      dv.setUint32(14,crc,true);dv.setUint32(18,data.length,true);dv.setUint32(22,data.length,true);
      dv.setUint16(26,name.length,true);
      lh.set(name,30);parts.push(lh,data);
      var ch=new Uint8Array(46+name.length),cv=new DataView(ch.buffer);
      cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0,true);
      cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);
      cv.setUint16(28,name.length,true);cv.setUint32(42,off,true);
      ch.set(name,46);cen.push(ch);
      off+=lh.length+data.length;
    });
    var cenLen=cen.reduce(function(a,b){return a+b.length},0);
    var eo=new Uint8Array(22),ev=new DataView(eo.buffer);
    ev.setUint32(0,0x06054b50,true);ev.setUint16(8,files.length,true);ev.setUint16(10,files.length,true);
    ev.setUint32(12,cenLen,true);ev.setUint32(16,off,true);
    return new Blob(parts.concat(cen,[eo]),{type:mime||'application/zip'});
  }

  /* ── XML helpers ──────────────────────────────────────────────────────── */
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function colName(i){var s='';i++;while(i>0){var m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=(i-m-1)/26}return s}

  function cell(ci,ri,c){
    var v,s,n;
    if(c&&typeof c==='object'&&!(c instanceof Date)){v=c.v;s=c.s;n=c.n}
    else{v=c;n=(typeof c==='number')}
    var r=colName(ci)+ri,st=s?' s="'+s+'"':'';
    if(v===null||v===undefined||v==='')return '<c r="'+r+'"'+st+'/>';
    if(n)return '<c r="'+r+'"'+st+'><v>'+v+'</v></c>';
    return '<c r="'+r+'" t="inlineStr"'+st+'><is><t xml:space="preserve">'+esc(v)+'</t></is></c>';
  }

  function sheetXml(sh){
    var sd='';
    (sh.rows||[]).forEach(function(row,ri){
      var r=ri+1,cells='';
      (row||[]).forEach(function(c,ci){cells+=cell(ci,r,c)});
      var h=(sh.heights&&sh.heights[ri])?' ht="'+sh.heights[ri]+'" customHeight="1"':'';
      sd+='<row r="'+r+'"'+h+'>'+cells+'</row>';
    });
    var cols='';
    if(sh.widths&&sh.widths.length){
      cols='<cols>'+sh.widths.map(function(w,i){
        return '<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+w+'" customWidth="1"/>';
      }).join('')+'</cols>';
    }
    var pane='';
    if(sh.freeze){
      var m=/^([A-Z]+)(\d+)$/.exec(sh.freeze);
      var x=0,cs=m[1];for(var i=0;i<cs.length;i++)x=x*26+(cs.charCodeAt(i)-64);
      pane='<pane '+(x>1?'xSplit="'+(x-1)+'" ':'')+'ySplit="'+(+m[2]-1)+'" topLeftCell="'+sh.freeze+'" activePane="bottomLeft" state="frozen"/>';
    }
    var mg=(sh.merges&&sh.merges.length)
      ? '<mergeCells count="'+sh.merges.length+'">'+sh.merges.map(function(m){return '<mergeCell ref="'+m+'"/>'}).join('')+'</mergeCells>'
      : '';
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'+
      '<sheetViews><sheetView workbookViewId="0" showGridLines="0">'+pane+'</sheetView></sheetViews>'+
      cols+'<sheetData>'+sd+'</sheetData>'+mg+
      '<pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/>'+
      '<pageSetup orientation="landscape" fitToWidth="1" paperSize="9"/>'+
      '</worksheet>';
  }

  /* Style ids usable as cell.s — kept aligned with the Variation A palette */
  var S={DEFAULT:0,TITLE:1,HEAD:2,BODY:3,WRAP:4,BOLD:5,META:6,NUM:7};
  var styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'+
    '<fonts count="4">'+
      '<font><sz val="10"/><name val="Calibri"/></font>'+
      '<font><b/><sz val="13"/><color rgb="FF0B61C2"/><name val="Calibri"/></font>'+
      '<font><b/><sz val="10"/><name val="Calibri"/></font>'+
      '<font><b/><sz val="10"/><color rgb="FF0F172A"/><name val="Calibri"/></font>'+
    '</fonts>'+
    '<fills count="3">'+
      '<fill><patternFill patternType="none"/></fill>'+
      '<fill><patternFill patternType="gray125"/></fill>'+
      '<fill><patternFill patternType="solid"><fgColor rgb="FFE6F0FB"/><bgColor indexed="64"/></patternFill></fill>'+
    '</fills>'+
    '<borders count="2">'+
      '<border><left/><right/><top/><bottom/><diagonal/></border>'+
      '<border><left style="thin"><color rgb="FFCBD5E1"/></left><right style="thin"><color rgb="FFCBD5E1"/></right><top style="thin"><color rgb="FFCBD5E1"/></top><bottom style="thin"><color rgb="FFCBD5E1"/></bottom><diagonal/></border>'+
    '</borders>'+
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'+
    '<cellXfs count="8">'+
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'+
      '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>'+
      '<xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>'+
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>'+
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>'+
      '<xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf>'+
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>'+
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf>'+
    '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'+
    '</styleSheet>';

  /* ── Workbook ─────────────────────────────────────────────────────────── */
  function build(sheets){
    var parts=[
      {name:'[Content_Types].xml',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'+
        '<Default Extension="xml" ContentType="application/xml"/>'+
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+
        sheets.map(function(s,i){return '<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'}).join('')+
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+
        '</Types>'},
      {name:'_rels/.rels',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'+
        '</Relationships>'},
      {name:'xl/workbook.xml',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'+
        '<sheets>'+sheets.map(function(s,i){
          /* Excel sheet-name rules: ≤31 chars, none of : \ / ? * [ ] */
          var nm=String(s.name||('Sheet'+(i+1))).replace(/[:\\\/\?\*\[\]]/g,'-').slice(0,31);
          return '<sheet name="'+esc(nm)+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>';
        }).join('')+'</sheets></workbook>'},
      {name:'xl/_rels/workbook.xml.rels',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
        sheets.map(function(s,i){return '<Relationship Id="rId'+(i+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>'}).join('')+
        '<Relationship Id="rId'+(sheets.length+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'+
        '</Relationships>'},
      {name:'xl/styles.xml',data:styles}
    ];
    sheets.forEach(function(s,i){parts.push({name:'xl/worksheets/sheet'+(i+1)+'.xml',data:sheetXml(s)})});
    return zip(parts,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }

  function save(blob,filename){
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;a.download=filename;
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    setTimeout(function(){URL.revokeObjectURL(url)},4000);
  }

  function write(filename,sheets){var b=build(sheets);save(b,filename);return b}

  /* CSV fallback — kept because a plain Blob download needs no xlsx machinery */
  function csv(rows){
    return rows.map(function(r){
      return r.map(function(c){
        var v=(c&&typeof c==='object')?c.v:c;
        v=(v===null||v===undefined)?'':String(v);
        return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;
      }).join(',');
    }).join('\r\n');
  }

  return {write:write,build:build,zip:zip,save:save,csv:csv,S:S,colName:colName};
})();
