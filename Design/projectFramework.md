# Excavation Manpower & Production Calculator
## Functional Specification and Feature Inventory
*(Consolidated from provided PDFs and Excel tool: Excavation Cal. + Master Data)*

---

## 1. Purpose and Scope

This application replaces the current Excel-based **Excavation Cal.** workflow with an intuitive, auditable **Next.js web application** focused on:

- Excavation **volumes** (Bank and Loose)
- **Manpower requirements** only (no cost projection)
- **Labor hours** by role
- **Equipment hours**
- **Total duration** in workdays based on crew size and schedule

The application must **fully preserve** all logic and outputs present in the Excel tool, while expanding it with:
- Auto-sizing based on pipe diameter
- Explicit hand-dig vs machine-dig determination near gas facilities
- Clear separation of inputs, rules, assumptions, and results

---

## 2. Governing Safety and Engineering Constraints (from provided PDFs)

### 2.1 Soil Classification and Sloping Rules
- Soil types: Stable Rock, Type A, Type B, Type C
- Sloping ratios (horizontal : vertical):
  - Type A: 0.75H : 1V
  - Type B: 1.0H : 1V
  - Type C: 1.5H : 1V
- If layered soils exist, the **least stable soil controls the entire excavation**
- Slopes must be flattened if signs of distress appear

**Impact on calculator**
- Soil type is a required input
- Slope ratio can be auto-selected from soil type or manually overridden
- Top width must be derived from bottom width, depth, and slope

---

### 2.2 Excavation Protection Methods
Supported excavation configurations:
- Sloped excavation
- Vertical excavation with shielding or shoring
- Sloped excavation with lower vertical walls (optional future enhancement)

**Impact on calculator**
- Determines whether top width expands with depth
- Directly affects bank volume calculation

---

### 2.3 Utility Damage Prevention and Hand Digging
- Excavation near existing gas facilities requires special damage prevention procedures
- Safety manual references a separate “Excavation for Damage Prevention” procedure
- Numeric tolerance-zone distances are not defined in the provided PDFs

**Impact on calculator**
- Hand-dig rules must be configurable, not hard-coded
- Calculator must explicitly split excavation into:
  - Machine-dug volume
  - Hand-dug volume (or vacuum excavation if enabled)

---

## 3. Core Geometry and Pipe-Based Auto Sizing

### 3.1 Pipe Inputs
- Nominal Pipe Size (NPS)
- Outside Diameter (OD)
  - Derived from Master Data lookup
  - Manual override allowed

---

### 3.2 Trench Bottom Width (Auto)
- Computed from pipe OD and clearance rules
- Default rule structure:
  - Bottom width = Pipe OD + (2 × side clearance)
- Side clearance must be rule-driven and editable (OD ranges)

---

### 3.3 Bedding Depth (Authoritative Rule)
- Bedding depth (inches) = **max(pipe OD ÷ 3, 4 inches)**
- Always computed automatically
- Optional override allowed with justification

Converted internally to feet for volume calculations

---

### 3.4 Trench Depth (Auto or Manual)
If auto:
- Depth = Cover to top of pipe
  + Pipe OD
  + Bedding depth
  + Working clearance below pipe
  + Optional freeboard

If manual:
- User-entered depth overrides auto sizing

---

## 4. Excavation Item Types (Must Match Excel)

### 4.1 Trenches
Per line:
- Length
- Pipe size
- Depth (auto or manual)
- Bottom width (auto or manual)
- Slope ratio or shoring selection
- Soil condition (machine and hand)
- Sawcut option
- Utility proximity scenario

---

### 4.2 Bell Holes
- Straight bell holes
- Sloped bell holes
Inputs include:
- Quantity
- Geometry (rule-based or manual)
- Depth
- Soil conditions
- Shoring or sloping selection
- Sawcut option

---

### 4.3 Potholes / Exposures (if enabled)
- Small, hand- or vacuum-dug excavations
- Typically fully hand-dug
- Used for utility verification

---

## 5. Volume Calculations

### 5.1 Bank Volume
- Computed from excavation geometry
- Uses:
  - Bottom width
  - Top width (if sloped)
  - Depth
  - Length or quantity

---

### 5.2 Loose Volume
- Derived from Bank Volume
- Uses load factor or swell factor from Master Data
- Loose Volume = Bank Volume × (1 + swell)

---

## 6. Hand Dig vs Machine Dig Logic

### 6.1 Proximity Scenarios
Per excavation item:
- No conflict
- Parallel to existing utility
- Crossing utility
- Exposure / pothole

---

### 6.2 Hand Dig Rule Inputs
- Tolerance zone width (configurable default)
- Buffer length each side of crossing
- Vertical extent:
  - Full depth
  - Pipe zone only
- Method:
  - Hand tools
  - Vacuum excavation

---

### 6.3 Derived Outputs
- Hand-dug bank volume
- Machine-dug bank volume
- Hand-dug loose volume
- Machine-dug loose volume

Manual overrides must be allowed:
- Fixed CY hand-dig
- Percentage split

---

## 7. Productivity and Rate Tables (from Master Data)

### 7.1 Machine Excavation
Indexed by:
- Bucket width or trench width
- Soil condition

Outputs:
- Production rate (CY/hr)
- Machine hours = Machine volume ÷ rate

---

### 7.2 Hand Excavation
Indexed by:
- Soil condition

Outputs:
- Hand excavation hours = Hand volume ÷ (rate × laborers assigned)

---

### 7.3 Additional Activities (if enabled)
- Sawcut (LF/hr)
- Vacuum excavation (CY/hr)
- Shoring install/remove allowances

---

## 8. Equipment Modeling (Non-Cost)

- Excavator count
- Bucket width / capacity
- Vacuum truck (optional)
- Sawcut crew (optional)

Outputs:
- Equipment hours by type
- Equipment utilization summary

---

## 9. Crew Definition and Scheduling

### 9.1 Crew Inputs
- Operators count
- Laborers count
- Optional roles:
  - Foreman
  - Spotter
  - Competent person

---

### 9.2 Work Schedule
- Hours per day
- Shifts per day
- Working days per week

---

### 9.3 Duration Calculation
- Machine duration = Machine hours ÷ (operators × hours/day)
- Hand duration = Hand hours ÷ (laborers × hours/day)
- **Critical path controls**
- Total duration reported in workdays
- Optional conversion to calendar days

---

## 10. Outputs (Must Be Fully Auditable)

### 10.1 Totals
- Total bank volume
- Total loose volume
- Total labor hours
- Total duration (days)

---

### 10.2 Crew Summary
- Hours per role
- Hours per individual
- Identification of critical path driver

---

### 10.3 Equipment Summary
- Equipment list
- Assumed production parameters
- Resulting hours

---

### 10.4 Line Item Detail
For each trench or bell hole:
- Geometry used (auto vs override)
- Soil type
- Slope or shoring method
- Hand vs machine volume split
- Production rates used
- Assumptions applied

---

## 11. Architectural Intent (for Next.js App)

- **Inputs**: User-entered or rule-driven
- **Rules**: Editable tables derived from Master Data
- **Calculations**: Deterministic, transparent, repeatable
- **Results**: Fully traceable back to inputs and rules

The application must always answer:
> “Why did this take this many hours?”

---

## 12. Explicit Non-Goals
- No cost calculation
- No pricing
- No estimating markups
- No crew wage logic

Only **manpower, equipment hours, and duration**.

---

## 13. Future-Ready Extensions (Not Required for MVP)
- Elevation-based depth auto sizing
- Excavator model-based production (cycle time, efficiency)
- Multi-crew phasing
- Weather or access efficiency modifiers

---

**This document is the authoritative functional baseline.  
Any feature present in Excel must exist here; any feature here must be explainable to a field reviewer.**
