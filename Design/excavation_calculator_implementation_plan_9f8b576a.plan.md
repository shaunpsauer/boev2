---
name: Excavation Calculator Implementation Plan
overview: Build a Next.js multi-tool platform starting with an Excavation Manpower & Production Calculator that replaces the Excel-based workflow, preserving all logic while providing an intuitive, auditable web interface.
todos: []
isProject: false
---

# Excavation Calculator Implementation Plan

## Project Overview

This plan guides the implementation of a Next.js multi-tool platform, beginning with an **Excavation Manpower & Production Calculator**. The calculator replaces an Excel-based workflow while preserving all existing logic and calculations, with a focus on volumes, manpower, labor hours, equipment hours, and duration (no cost calculations).

## Architecture Foundation

### Technology Stack

- **Framework**: Next.js 16 or higher (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.x
- **UI Components**: shadcn/ui (where appropriate)
- **Design Tool**: Pencil (.pen files) for UI/UX design
- **Storage**: Client-side (IndexedDB/localStorage) for calculations
- **Master Data**: Config files (TypeScript/JSON)
- **Form Management**: React Hook Form + Zod
- **State Management**: React Context + hooks (consider Zustand for complex state)

### Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing/home page
│   ├── calculators/                  # Calculators route group
│   │   ├── layout.tsx                # Calculators shared layout
│   │   └── excavation/               # Excavation calculator
│   │       ├── page.tsx              # Main calculator page
│   │       ├── components/           # Calculator-specific components
│   │       ├── lib/                  # Calculator logic
│   │       ├── config/               # Master data configs
│   │       └── hooks/                 # Calculator hooks
│   └── tools/                        # Future tools route group
├── components/
│   ├── ui/                           # shadcn/ui components
│   └── shared/                       # Shared components
├── lib/
│   ├── utils.ts                      # Utility functions
│   └── storage.ts                    # Client-side storage utilities
└── types/                            # TypeScript type definitions
```

## Core Implementation Phases

### Phase 1: Foundation & Master Data

#### 1.1 Master Data Configuration Files

Create config files in `src/app/calculators/excavation/config/`:

**Pipe Master Data** (`pipe-master.ts`):

- NPS (Nominal Pipe Size) to OD (Outside Diameter) lookup table
- Side clearance rules by OD ranges
- Bedding depth calculation rule: `max(pipe OD ÷ 3, 4 inches)`

**Soil Classification** (`soil-classification.ts`):

- Soil types: Stable Rock, Type A, Type B, Type C
- Slope ratios (horizontal:vertical):
  - Type A: 0.75H:1V
  - Type B: 1.0H:1V
  - Type C: 1.5H:1V
- Swell factors by soil type

**Production Rate Tables** (`production-rates.ts`):

- Machine excavation rates (CY/hr) indexed by:
  - Bucket width or trench width ranges
  - Soil condition
- Hand excavation rates (CY/hr) indexed by:
  - Soil condition
- Additional activities (if enabled):
  - Sawcut (LF/hr)
  - Vacuum excavation (CY/hr)

**Equipment Specifications** (`equipment-specs.ts`):

- Excavator classes (Micro, Mini, Small, Medium, Large)
- Bucket specifications (width, capacity)
- Vacuum truck specs (if applicable)

#### 1.2 Type Definitions

Create comprehensive TypeScript types in `src/types/excavation.ts`:

- `PipeInput`, `SoilType`, `ExcavationType`
- `TrenchItem`, `BellHoleItem`, `PotholeItem`
- `ProximityScenario`, `HandDigRule`
- `ProductionRate`, `EquipmentSpec`
- `CalculationResult`, `CrewSummary`, `EquipmentSummary`
- `AuditTrail` (for traceability)

### Phase 2: Core Calculation Engine

#### 2.1 Geometry Calculations (`lib/geometry.ts`)

Implement deterministic geometry calculations:

- **Trench Bottom Width**: Auto from pipe OD + clearance rules, or manual override
- **Bedding Depth**: `max(pipe OD ÷ 3, 4 inches)` (authoritative rule)
- **Trench Depth**: Auto from cover + pipe OD + bedding + clearance, or manual
- **Top Width**: Derived from bottom width, depth, and slope ratio
- **Bank Volume**: Trapezoidal volume calculation for sloped excavations
- **Loose Volume**: Bank volume × (1 + swell factor)

#### 2.2 Hand-Dig vs Machine-Dig Logic (`lib/hand-dig-logic.ts`)

Implement configurable hand-dig determination:

- **Proximity Scenarios**: No conflict, Parallel, Crossing, Exposure
- **Tolerance Zone Calculation**: Configurable width and buffer lengths
- **Volume Splitting**: Calculate hand-dug vs machine-dug volumes
- **Override Support**: Fixed CY or percentage split overrides
- **Method Selection**: Hand tools vs vacuum excavation

#### 2.3 Production Calculations (`lib/production.ts`)

Implement production rate lookups and calculations:

- **Machine Hours**: Machine volume ÷ production rate
- **Hand Hours**: Hand volume ÷ (rate × laborers)
- **Critical Path**: Determine controlling duration (machine vs hand)
- **Duration**: Convert hours to workdays based on crew schedule

#### 2.4 Crew & Schedule Calculations (`lib/crew-scheduling.ts`)

Implement crew modeling:

- **Crew Definition**: Operators, laborers, optional roles (foreman, spotter, competent person)
- **Schedule Inputs**: Hours per day, shifts per day, working days per week
- **Duration Calculation**: 
  - Machine duration = Machine hours ÷ (operators × hours/day)
  - Hand duration = Hand hours ÷ (laborers × hours/day)
  - Total duration = max(machine duration, hand duration) in workdays

### Phase 3: User Interface Components

#### 3.1 Input Forms

Create form components using React Hook Form + Zod:

**Main Input Form** (`components/ExcavationInputForm.tsx`):

- Pipe selection (NPS with OD lookup)
- Excavation type selector (Trench, Bell Hole, Pothole)
- Geometry inputs (length, depth, width) with auto-sizing toggles
- Soil classification selector
- Slope/shoring selection
- Utility proximity scenario selector
- Crew inputs (operators, laborers, optional roles)
- Schedule inputs (hours/day, shifts, working days)

**Hand-Dig Configuration** (`components/HandDigConfig.tsx`):

- Tolerance zone width input
- Buffer length inputs
- Vertical extent selection (full depth vs pipe zone)
- Method selection (hand tools vs vacuum)
- Override options (fixed CY or percentage)

**Settings Panel** (`components/SettingsPanel.tsx`):

- Editable rule overrides (clearance rules, production rates)
- Default assumptions
- Calculation preferences

#### 3.2 Results Display

Create results components with full auditability:

**Summary View** (`components/ResultsSummary.tsx`):

- Total bank volume
- Total loose volume
- Total labor hours (by role)
- Total equipment hours
- Total duration (workdays)

**Crew Summary** (`components/CrewSummary.tsx`):

- Hours per role
- Hours per individual
- Critical path identification

**Equipment Summary** (`components/EquipmentSummary.tsx`):

- Equipment list with assumed parameters
- Resulting hours per equipment type
- Utilization summary

**Line Item Detail** (`components/LineItemDetail.tsx`):

- Per-item breakdown showing:
  - Geometry used (auto vs override)
  - Soil type and slope method
  - Hand vs machine volume split
  - Production rates used
  - Assumptions applied

**Audit Trail** (`components/AuditTrail.tsx`):

- Traceability view showing:
  - Input values
  - Rules applied
  - Calculation steps
  - Overrides used

#### 3.3 Multi-Item Management

**Item List** (`components/ExcavationItemList.tsx`):

- Add/edit/delete excavation items (trenches, bell holes, potholes)
- Bulk operations
- Item reordering

### Phase 4: Data Persistence & Storage

#### 4.1 Client-Side Storage (`lib/storage.ts`)

Implement IndexedDB/localStorage utilities:

- **Save Calculations**: Store calculation inputs and results
- **Load Calculations**: Retrieve saved calculations
- **Calculation History**: Track calculation versions
- **Export/Import**: JSON export for backup/sharing

#### 4.2 Calculation Schema

Define storage schema:

```typescript
interface StoredCalculation {
  id: string;
  name: string;
  timestamp: Date;
  inputs: ExcavationInputs;
  results: CalculationResult;
  auditTrail: AuditTrail;
  version: number; // For future compatibility
}
```

### Phase 5: Validation & Error Handling

#### 5.1 Input Validation

- Zod schemas for all inputs
- Real-time validation feedback
- Clear error messages
- Constraint checking (e.g., depth must be positive, slope ratios valid)

#### 5.2 Calculation Validation

- Validate rule lookups (ensure rates exist for soil/bucket combinations)
- Check for division by zero
- Validate geometry (e.g., top width > bottom width for sloped)
- Warn on unusual inputs (e.g., very deep excavations)

### Phase 6: Testing & Quality Assurance

#### 6.1 Unit Tests

- Geometry calculations (test against known Excel outputs)
- Production rate lookups
- Hand-dig volume splitting
- Duration calculations

#### 6.2 Integration Tests

- End-to-end calculation flow
- Multi-item calculations
- Override handling

#### 6.3 Excel Parity Testing

- Compare outputs against original Excel tool
- Document any discrepancies
- Ensure all Excel features are preserved

## Key Design Principles

### 1. Auditability First

Every result must be traceable:

- Show which inputs were used
- Display which rules were applied
- Indicate any overrides
- Provide calculation step-by-step breakdown

### 2. Deterministic Calculations

- All calculations must be repeatable
- No hidden state or side effects
- Clear separation: inputs → rules → calculations → results

### 3. Configurable Rules

- Master data in config files (not hardcoded)
- Allow rule overrides per calculation
- Support future admin UI for rule editing

### 4. Progressive Enhancement

- Core functionality works without JavaScript (form submission)
- Enhanced experience with client-side calculations
- Offline-capable where possible

### 5. Multi-Tool Architecture

- Calculator is first tool in platform
- Structure supports adding more calculators/tools
- Shared components and utilities
- Consistent navigation and layout

## Implementation Guidelines

### Code Organization

- **Separation of Concerns**: UI components, business logic, and data/config are separate
- **Single Responsibility**: Each module/function has one clear purpose
- **DRY Principle**: Extract common logic into utilities
- **Type Safety**: Leverage TypeScript for compile-time safety

### Component Patterns

- **Controlled Components**: Use React Hook Form for form state
- **Composition**: Build complex UIs from simple components
- **Custom Hooks**: Extract calculation logic into hooks (e.g., `useExcavationCalculation`)
- **Context for Settings**: Use React Context for global settings/configuration

### Performance Considerations

- **Memoization**: Use `useMemo` for expensive calculations
- **Lazy Loading**: Code-split calculator routes
- **Optimistic Updates**: Show results immediately, validate async

### Accessibility

- **Semantic HTML**: Proper form labels and ARIA attributes
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Descriptive labels and announcements
- **Focus Management**: Clear focus indicators

## Future Extensions (Post-MVP)

### Additional Calculators

- Structure supports adding more calculators
- Shared calculation patterns
- Consistent UI/UX

### Enhanced Features

- Elevation-based depth auto-sizing
- Excavator model-based production (cycle time, efficiency)
- Multi-crew phasing
- Weather/access efficiency modifiers
- Export to PDF/Excel
- Calculation templates/presets

### Admin Features

- Rule editing UI
- Master data management
- User preferences
- Calculation analytics

## Success Criteria

1. **Functional Parity**: All Excel tool features preserved
2. **Accuracy**: Calculations match Excel outputs within acceptable tolerance
3. **Usability**: Intuitive interface requiring minimal training
4. **Auditability**: Every result fully traceable to inputs and rules
5. **Performance**: Calculations complete in <100ms for typical inputs
6. **Reliability**: No calculation errors or crashes
7. **Maintainability**: Code is well-structured and documented

## References

- **Functional Specification**: `projectFramework.md` (authoritative requirements)
- **Design Specifications**: `design.pen` (UI/UX design)
- **Component Styling**: `COMPONENT_STYLING.md` (shadcn/ui patterns)

## Notes

- This is a completely new project - do not reference existing excavation-calculator code
- Design will be created in Pencil (.pen files) - implement UI based on design specifications
- Master data is code-based (config files) - not database-driven
- Calculations stored client-side (IndexedDB/localStorage) - no server persistence required
- Focus on MVP first - future extensions can be added incrementally

