# STL AI-Powered ATS — Project Knowledge Base

> **Project:** AI-Powered Applicant Tracking System with Intelligent CV Screening
> **Client:** Square Toiletries Limited (STL)
> **Document Type:** Project Knowledge & Reference
> **Scope:** Full hiring pipeline — CV intake → parsing → AI screening → shortlisting → interview scheduling

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Core Design Principles](#2-core-design-principles)
3. [Technology Stack](#3-technology-stack)
4. [System Roles & Access Levels](#4-system-roles--access-levels)
5. [User Journeys](#5-user-journeys)
6. [Feature Modules](#6-feature-modules)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Scope Boundary & Known Limitations](#8-scope-boundary--known-limitations)
9. [AI Governance & Compliance](#9-ai-governance--compliance)
10. [Integration Points](#10-integration-points)
11. [Deployment Options](#11-deployment-options)

---

## 1. Project Overview

### Problem Statement

STL's HR team manually processes large volumes of CVs against position-specific criteria. This causes:

- Slow processing throughput
- Inconsistency across individual reviewers
- No reusable talent pool
- Inability to audit past screening decisions

### Solution

A web-based Applicant Tracking System (ATS) where:

- HR creates job positions and defines weighted screening criteria
- CVs are bulk-uploaded (5,000+ per batch)
- AI parses, scores, and shortlists candidates against those criteria
- HR retains full override authority at every stage
- Human review is mandatory before any candidate rejection

---

## 2. Core Design Principles

| Principle | Description |
|-----------|-------------|
| **Human-in-the-loop** | AI assists; HR decides. Zero automated rejections. |
| **Explainable scoring** | Every match score shows which criteria contributed and what CV evidence was used. |
| **Position-wise configurability** | Different roles get different templates, weights, and thresholds. |
| **Bilingual support** | Bangla + English CVs treated as first-class via language-aware OCR and bilingual dictionaries. |
| **Modular architecture** | Frontend, backend API, AI service, OCR, search, queue, and storage are fully decoupled. |
| **Deployment flexibility** | Cloud, on-premise, or hybrid depending on STL's data residency requirements. |

---

## 3. Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + TypeScript |
| **Backend API** | Laravel (PHP) — REST |
| **AI Service** | Python FastAPI |
| **Database** | PostgreSQL |
| **Search** | OpenSearch / Elasticsearch |
| **Queue / Workers** | Redis + Celery |
| **Storage** | S3-compatible object storage |
| **OCR** | Azure Document Intelligence / Google Document AI / On-premise option |
| **CI/CD** | GitHub Actions / GitLab CI |
| **Containerization** | Docker |

---

## 4. System Roles & Access Levels

### Role Summary

| Role | Upload CVs | Configure Templates | Override AI Score | Record Interview Feedback | Read-Only Access |
|------|-----------|--------------------|--------------------|--------------------------|-----------------|
| **Admin** | — | — | — | — | Full system |
| **HR** | ✅ | ✅ | ✅ | — | ✅ |
| **Hiring Manager** | ❌ | ❌ | ❌ | ✅ | Assigned positions |
| **Viewer** | ❌ | ❌ | ❌ | ❌ | Assigned positions |

### Role Descriptions

**Admin**
- Manages user accounts, roles, and module-level permissions
- Activates/deactivates users
- Configures system-wide settings: SMS gateway, SMTP, email/job-portal integrations, data retention policy
- Monitors full audit trail (uploads, scoring runs, overrides, exports)

**HR** *(Primary user)*
- Creates and manages job positions and screening templates
- Uploads and manages CV batches
- Reviews AI screening results and score explanations
- Overrides AI decisions (with mandatory reason capture)
- Communicates with candidates via email/SMS
- Schedules interviews
- Exports shortlists and reports

**Hiring Manager**
- Reviews shortlisted candidates forwarded by HR
- Adds interview comments and feedback
- Can accept/reject candidates for next round or send back to HR
- Cannot upload CVs or override AI scoring at the screening level

**Viewer**
- Read-only access to assigned positions, candidate profiles, and reports
- Intended for department heads and internal audit stakeholders

---

## 5. User Journeys

### 5.1 HR Journey (Primary Flow)

```
Login
  └─ Dashboard (open positions / pending runs / recent applications / shortlist counts)
       └─ Create Job Position (title, department, designation, description)
            └─ Build Screening Template
                 ├─ Select criteria (age, gender, education, experience, skills, location, certifications)
                 ├─ Set weights per criterion (e.g. skills 40%, experience 30%, education 20%, location 10%)
                 ├─ Add include keywords (must-have)
                 ├─ Add exclude keywords (disqualifiers)
                 └─ Set auto-shortlist score threshold (e.g. 75%)
                      └─ Upload CVs (drag-and-drop or email/portal import, 5,000+ per batch)
                           └─ Monitor Batch Progress
                                [pending → processing → parsed → screened → shortlisted / rejected-pending-review / duplicate / failed]
                                └─ Review Duplicates (keep / merge / discard)
                                     └─ Open Screening Results
                                          ├─ Ranked candidate list with AI match score (%)
                                          ├─ Score explanation panel (criteria contributions, CV evidence, red flags)
                                          └─ Act on Candidates
                                               ├─ Accept auto-shortlist
                                               ├─ Manual override (with logged reason)
                                               └─ Tag / bookmark for talent pool
                                                    └─ Communicate & Schedule
                                                         ├─ Send email/SMS notifications
                                                         ├─ Schedule interviews (slots, panels, invites)
                                                         └─ Export (Excel, CV bundle, screening report)
```

### 5.2 Admin Journey

1. Log in → Admin dashboard
2. Create user accounts for HR, Hiring Managers, Viewers
3. Assign roles and module-level permissions
4. Configure system-wide settings
5. Monitor audit trail

### 5.3 Hiring Manager Journey

1. Log in → View assigned positions
2. Review shortlisted candidates (score, explanation, parsed profile, original CV)
3. Add comments → accept/reject for next round or return to HR
4. Record interview feedback

### 5.4 Viewer Journey

1. Log in → Read-only view of assigned positions, profiles, and reports
2. No edit or decision capability

---

## 6. Feature Modules

### Module 1 — User Management & Security

- Admin/user ID and password management with password policy enforcement
- Role-based access control (Admin, HR, Hiring Manager, Viewer)
- User activation/deactivation
- Module-level permission control
- Session/token management
- Full audit trail: uploads, parsing, scoring, overrides, shortlist movements, exports, admin actions
- Encryption in transit (TLS) and at rest
- File upload validation and malware scanning integration readiness

### Module 2 — CV Upload & Parsing

- Drag-and-drop upload from web UI
- Bulk upload: 5,000+ CVs per batch via asynchronous queue
- Supported formats: PDF (digital and scanned), Word (.doc / .docx), JPG, PNG
- OCR for scanned PDFs and image-based CVs
- Bangla + English bilingual parsing (Unicode normalization, language-aware OCR, bilingual dictionaries)
- Per-file processing status tracking: `pending → processing → parsed → failed / duplicate`
- Duplicate detection within current batch (file hash)
- Duplicate candidate detection against existing database (email, phone, name, profile similarity)
- Email inbox import (subject to credentials/API)
- Job portal import (subject to credentials/API)
- Extraction confidence indicators and missing-field flags per parsed CV

### Module 3 — AI Screening & Matching

- Position-wise screening templates and configurable prompts
- Configurable criteria: age, gender, education, years of experience, specific past positions, skills, location, certifications, and other agreed structured fields
- Weighted scoring — configurable weight per criterion per position
- Multi-criteria filter combinations
- Include-keyword filtering (must-have terms)
- Exclude-keyword filtering (automatic disqualifiers)
- AI matching score as a percentage
- Auto-shortlist on configurable threshold
- Auto-move shortlisted CVs into separate shortlist folder/list

**Red flag detection:**
- Career break
- Frequent job changes
- Missing information
- Overqualification / underqualification
- Skill gap analysis

**Score explanation panel includes:**
- Per-criterion contribution breakdown
- Matched / missed evidence from CV
- Red flags with reasoning

- Re-screening on criteria change without requiring re-upload

### Module 4 — Candidate Database & History

- Centralized candidate master profile from parsed data
- Full application history per candidate
- Display of last application date
- Display of previously applied positions
- Display of previous shortlist status
- Candidate tagging (custom labels)
- Candidate bookmarking
- Talent pool / searchable candidate database for future hiring
- Full-text and structured search across profiles, skills, tags, and parsed CV content

### Module 5 — Export & Reporting

- Bulk CV download (original files) for filtered or shortlisted candidates
- Excel export with customizable field selection (name, contact, email, home district, education, experience, and others)
- Final candidate summary in STL's predefined Excel format
- Downloadable screening reports
- Interview panel summary generation
- Export/download audit logging

### Module 6 — Integration & Workflow

- Automated email notifications via SMTP (templated messages)
- Automated SMS notifications via agreed SMS gateway (templated messages)
- Interview scheduling — slot creation, panel assignment, candidate invitation
- Notification delivery status tracking
- Schedule status tracking

### Module 7 — AI Governance & Accuracy

- Explainable AI scoring with per-criterion breakdown and evidence
- HR manual override with mandatory reason capture (logged for audit and AI feedback)
- Weighted scoring suggestions in the template builder
- Human review enforced before any final rejection
- Version-controlled screening templates and prompts (full traceability)
- Accuracy benchmark / validation report from QA against manually annotated ground-truth CVs
- Controlled model retraining/tuning loop using validated HR feedback
- No use of sensitive criteria beyond client-approved screening setup
- AI governance aligned with: NIST AI RMF, ISO/IEC 42001, OWASP LLM Top 10

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Architecture** | Modular services: frontend / backend API / AI service / OCR / search / queue / storage / integrations |
| **Scalability** | Each service scales independently; queue-based processing for bulk operations |
| **Performance** | 5,000+ CV batch upload and processing via async workers |
| **Deployment** | Cloud, on-premise, or hybrid |
| **Data Retention** | Configurable retention policy with archival/deletion workflows and audit logging |
| **Monitoring** | Application logs, worker logs, error tracking, audit logs |
| **CI/CD** | GitHub Actions / GitLab CI pipelines |
| **Containerization** | Docker-based portable deployment |

---

## 8. Scope Boundary & Known Limitations

### In Scope

- Full hiring pipeline from CV intake to interview scheduling
- AI-assisted screening with explainable scores
- Human-in-the-loop control at every decision point
- Bilingual (Bangla + English) CV processing
- Candidate database and talent pool management
- Audit trails and AI governance tooling

### Out of Scope (Explicitly)

- **Fraud / Employment Verification:** The system detects inconsistency *indicators* (overlapping dates, unrealistic durations, suspicious patterns) but is **not** a fraud verification tool. Full verification requires integration with external employment-verification APIs — this is an HR process decision, not a system capability.
- **Candidate-facing portal:** Candidates receive email/SMS notifications only; there is no self-service portal in the current scope.
- **Automated rejections:** The system enforces human review before any rejection is finalized. No candidate can be rejected by AI alone.

---

## 9. AI Governance & Compliance

### Governance Standards Referenced

| Standard | Application |
|----------|-------------|
| **NIST AI RMF** | Risk management framework for AI system governance |
| **ISO/IEC 42001** | AI management system standard |
| **OWASP LLM Top 10** | Security considerations for large language model deployments |

### Key Governance Controls

- All AI scoring decisions are explainable — no black-box outputs
- HR override is always available with mandatory reason capture
- Overrides are logged and fed back into model improvement
- Screening templates are version-controlled for full audit traceability
- Sensitive criteria used only within client-approved screening configurations
- QA validation against manually annotated ground-truth CVs
- Controlled retraining loop — model updates only via validated feedback

---

## 10. Integration Points

| Integration | Type | Notes |
|-------------|------|-------|
| **Email Inbox** | Import | Subject to client credentials/API access |
| **Job Portals** | Import | Subject to portal credentials/API access |
| **SMTP** | Outbound notification | Templated emails to candidates |
| **SMS Gateway** | Outbound notification | Agreed gateway; templated SMS to candidates |
| **OCR Provider** | AI/cloud service | Azure Document Intelligence / Google Document AI / on-premise |
| **Employment Verification APIs** | Future/optional | Not in current scope; would extend fake-experience detection |
| **Malware Scanning** | Security | Integration-ready; specific tool TBD |

---

## 11. Deployment Options

| Mode | Description |
|------|-------------|
| **Cloud** | Hosted on a public cloud provider; STL accesses via the internet |
| **On-Premise** | All services run within STL's own infrastructure; full data residency control |
| **Hybrid** | Core services on-premise; selected services (e.g. OCR) via cloud APIs |

The Docker-based architecture enables portable deployment across all three modes without code changes.

---

## Appendix — CV Processing Status States

```
PENDING       → File received, queued for processing
PROCESSING    → Actively being parsed/OCR'd
PARSED        → Extraction complete, ready for screening
SCREENED      → AI scoring complete
SHORTLISTED   → Score ≥ threshold; moved to shortlist
REJECTED-PENDING-REVIEW → Score < threshold; awaiting mandatory HR review
DUPLICATE     → Matched to existing candidate or file in current batch
FAILED        → Parsing or processing error; requires manual review
```

---

## Appendix — Screening Criteria Reference

| Criterion | Configurable Weight | Notes |
|-----------|-------------------|-------|
| Skills | Yes | Primary criterion in most templates |
| Years of Experience | Yes | Total or role-specific |
| Education | Yes | Degree level, institution, field |
| Specific Past Positions | Yes | Job title matching |
| Age | Yes | Subject to local labour law compliance |
| Gender | Yes | Client-approved configurations only |
| Location / Home District | Yes | For proximity or regional hiring |
| Certifications | Yes | Professional credentials |
| Include Keywords | Threshold | Must-have; absence reduces score |
| Exclude Keywords | Disqualifier | Presence triggers automatic flag |

---

*This document reflects the agreed project scope and design at the time of proposal. Any changes to scope, stack, or design decisions should be versioned and appended.*
