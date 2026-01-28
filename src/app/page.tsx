export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[var(--color-white)]">
      {/* Navigation */}
      <nav className="flex items-center justify-between w-full px-[120px] py-6 border-b border-[var(--color-border)]">
        <div className="text-2xl font-semibold text-[var(--color-slate-800)]">
          BOE Tools
        </div>
        
        <div className="flex items-center gap-12">
          <a href="#tools" className="text-[15px] font-medium text-[var(--color-slate-500)] hover:text-[var(--color-slate-800)] transition-colors">
            Tools
          </a>
          <a href="#features" className="text-[15px] font-medium text-[var(--color-slate-500)] hover:text-[var(--color-slate-800)] transition-colors">
            Features
          </a>
          <a href="#contact" className="text-[15px] font-medium text-[var(--color-slate-500)] hover:text-[var(--color-slate-800)] transition-colors">
            Contact
          </a>
          <button className="flex items-center justify-center gap-2 px-5 py-[10px] h-10 bg-[var(--color-primary)] text-[var(--color-white)] text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex items-center w-full px-[120px] py-[100px] bg-gradient-to-b from-[var(--color-white)] to-[var(--color-slate-50)]">
        <div className="flex gap-20 w-full max-w-[1440px] mx-auto">
          <div className="flex flex-col gap-8 w-[600px]">
            <h1 className="text-[56px] font-semibold text-[var(--color-slate-800)] leading-[1.1]">
              Build Custom Tools for Construction Excellence
            </h1>
            <p className="text-lg text-[var(--color-slate-500)] leading-[1.6]">
              Platform for creating specialized construction calculators and productivity tools. From excavation estimates to project planning, build what you need.
            </p>
            <div className="flex gap-4">
              <button className="flex items-center justify-center gap-2 px-7 py-[14px] h-12 bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)] text-[var(--color-white)] text-base font-medium rounded-lg shadow-[0_4px_16px_rgba(30,58,138,0.25)] hover:shadow-[0_6px_20px_rgba(30,58,138,0.35)] transition-shadow">
                View Tools
              </button>
              <button className="flex items-center justify-center gap-2 px-7 py-[14px] h-12 bg-[var(--color-white)] text-[var(--color-slate-800)] text-base font-medium rounded-lg border border-[var(--color-border)] shadow-[0_2px_8px_rgba(30,41,59,0.06)] hover:shadow-[0_4px_12px_rgba(30,41,59,0.1)] transition-shadow">
                <span className="material-symbols-outlined text-[20px] text-[var(--color-slate-500)]" style={{ fontWeight: 400 }}>
                  code
                </span>
                View on GitHub
              </button>
            </div>
          </div>
          
          <div className="flex flex-1 items-center justify-center h-[500px] bg-gradient-to-br from-[var(--color-slate-50)] to-[var(--color-blue-50)] border-2 border-[var(--color-blue-100)] rounded-xl shadow-[0_8px_24px_rgba(30,58,138,0.08)]">
            <p className="text-sm font-medium text-[var(--color-slate-400)] text-center leading-[1.6] max-w-[200px]">
              Device Mockup Placeholder
              <br />
              (Laptop/Tablet Frame)
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="flex flex-col items-center w-full px-[120px] py-[100px] bg-gradient-to-b from-[var(--color-slate-50)] to-[var(--color-blue-50)]">
        <div className="flex flex-col gap-12 w-full max-w-[1440px] mx-auto">
          <h2 className="text-4xl font-semibold text-[var(--color-slate-800)] text-center">
            Key Features
          </h2>
          
          <div className="flex flex-col gap-6 w-full">
            <div className="flex gap-6 w-full">
              <FeatureCard
                icon="calculate"
                title="Excavation Calculator"
                description="Accurate manpower & production calculations for excavation projects"
              />
              <FeatureCard
                icon="straighten"
                title="Auto-Sizing Logic"
                description="Intelligent pipe diameter-based trench dimensioning"
              />
            </div>
            
            <div className="flex gap-6 w-full">
              <FeatureCard
                icon="verified_user"
                title="Safety Compliance"
                description="Built-in OSHA sloping and shoring requirements"
              />
              <FeatureCard
                icon="description"
                title="Detailed Reporting"
                description="Comprehensive breakdowns of labor hours and equipment needs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="flex flex-col items-center w-full px-[120px] py-[100px] bg-[var(--color-white)]">
        <div className="flex flex-col gap-12 w-full max-w-[1440px] mx-auto">
          <h2 className="text-4xl font-semibold text-[var(--color-slate-800)] text-center">
            Built With Modern Technologies
          </h2>
          
          <div className="flex items-center justify-center gap-8 w-full">
            <TechCard icon="N" label="Next.js" bgColor="var(--color-black)" />
            <TechCard icon="⚛" label="React" bgColor="var(--color-react)" />
            <TechCard icon="TS" label="TypeScript" bgColor="var(--color-ts)" />
            <TechCard icon="T" label="Tailwind CSS" bgColor="var(--color-tailwind)" />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="flex items-center justify-center w-full px-[120px] py-[100px] bg-[var(--color-primary)]">
        <div className="flex flex-col items-center gap-8 w-full max-w-[1440px] mx-auto">
          <h2 className="text-[40px] font-semibold text-[var(--color-white)] text-center leading-[1.2] max-w-[900px]">
            Ready to streamline your construction calculations?
          </h2>
          <p className="text-lg text-[var(--color-blue-200)] text-center">
            Explore the tools or view the source code on GitHub
          </p>
          <div className="flex gap-4">
            <button className="flex items-center justify-center gap-2 px-7 py-[14px] h-12 bg-[var(--color-white)] text-[var(--color-primary)] text-base font-medium rounded-lg hover:shadow-lg transition-shadow">
              Get Started
            </button>
            <button className="flex items-center justify-center gap-2 px-7 py-[14px] h-12 bg-[var(--color-primary)] text-[var(--color-white)] text-base font-medium rounded-lg border-2 border-[var(--color-white)] hover:bg-[#2952a3] transition-colors">
              <span className="material-symbols-outlined text-[20px]" style={{ fontWeight: 400 }}>
                code
              </span>
              View on GitHub
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-4 flex-1 p-8 bg-gradient-to-br from-[var(--color-white)] to-[#F0F9FF] border border-[var(--color-border)] rounded-lg shadow-[0_4px_12px_rgba(30,58,138,0.08)] hover:shadow-[0_6px_16px_rgba(30,58,138,0.12)] transition-shadow">
      <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)] rounded-full">
        <span className="material-symbols-outlined text-[40px] text-[var(--color-white)]" style={{ fontWeight: 400 }}>
          {icon}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-[var(--color-slate-800)]">
        {title}
      </h3>
      <p className="text-[15px] text-[var(--color-slate-500)] leading-[1.6]">
        {description}
      </p>
    </div>
  );
}

interface TechCardProps {
  icon: string;
  label: string;
  bgColor: string;
}

function TechCard({ icon, label, bgColor }: TechCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-[var(--color-slate-50)] rounded-xl hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-center w-20 h-20 rounded-lg text-[var(--color-white)] text-3xl font-bold" style={{ backgroundColor: bgColor }}>
        {icon}
      </div>
      <p className="text-lg font-semibold text-[var(--color-slate-800)]">
        {label}
      </p>
    </div>
  );
}
