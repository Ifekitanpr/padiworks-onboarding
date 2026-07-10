import {
  MockupCard,
  AvatarBubble,
  PointerArrow,
  GlassPanel,
  PillBadge,
} from "./panel-primitives";
import { Building2, Plus } from "lucide-react";

/** Pattern A — Strategy/Work Management/People&Performance board collage. Signup, login. */
export function BoardCollage() {
  return (
    <div className="absolute inset-0">
      <GlassPanel className="top-[37.79%] left-[75.47%] h-[11.31%] w-[28.65%]" />
      <GlassPanel className="top-[79.29%] left-[68.53%] h-[15.97%] w-[40.45%]" />
      <GlassPanel className="top-[88.8%] left-[-0.87%] h-[15.97%] w-[66.84%]" />

      <MockupCard
        className="top-[41.04%] left-[8.48%] h-[25.32%] w-[64.14%]"
        crop={{
          src: "/images/auth/board-strategy-work.png",
          width: "227.73%",
          height: "255.46%",
          left: "-65.32%",
          top: "-16.35%",
        }}
      />
      <PointerArrow src="/images/auth/arrow-a.svg" rotate="91.11deg" className="top-[44.19%] left-[46.88%] h-[4.79%] w-[7.1%]" />
      <AvatarBubble className="top-[40.98%] left-[49.81%]" src="/images/auth/avatar-a.jpg" />

      <MockupCard
        className="top-[69.81%] left-[5.55%] h-[25.32%] w-[64.14%]"
        crop={{
          src: "/images/auth/board-strategy-work.png",
          width: "227.73%",
          height: "255.46%",
          left: "-7.72%",
          top: "-126.5%",
        }}
      />
      <PointerArrow src="/images/auth/arrow-b.svg" rotate="-86.6deg" className="top-[79.57%] left-[34.11%] h-[4.94%] w-[7.41%]" />
      <AvatarBubble className="top-[82.14%] left-[28.36%]" src="/images/auth/avatar-b.jpg" />

      <MockupCard
        className="top-[59.81%] left-[54.16%] h-[27.23%] w-[69.39%] bg-white/20"
        innerClassName="inset-[6px]"
        crop={{
          src: "/images/auth/board-people-performance.png",
          width: "244.28%",
          height: "274.03%",
          left: "-133.1%",
          top: "-141.43%",
        }}
      />
      <PointerArrow src="/images/auth/arrow-c.svg" rotate="157.52deg" className="top-[65.09%] left-[71.97%] h-[5.5%] w-[10.22%]" />
      <AvatarBubble className="top-[66.24%] left-[78.24%]" src="/images/auth/avatar-c.jpg" />
    </div>
  );
}

/** Wrapper for the "centered" collage variants: title + graphic grouped and vertically centered. */
export function CenteredCollage({
  aspect,
  children,
}: {
  aspect: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full" style={{ aspectRatio: aspect }}>
      {children}
    </div>
  );
}

/** Pattern B — email notification stack. verify-email, forgot-password OTP. */
export function NotificationCollage() {
  return (
    <CenteredCollage aspect="418/272">
      <div className="absolute top-[76%] left-[4%] h-[24%] w-[89%] rounded-[4%] border border-white bg-white/40 opacity-10" />
      <div className="absolute top-[65%] left-[4%] h-[23%] w-[89%] rounded-[4%] border border-white bg-white/40 opacity-50" />
      <div className="absolute top-[11%] left-[4%] h-[23%] w-[89%] rounded-[4%] border border-white bg-white/40 opacity-50" />
      <div className="absolute top-[0%] left-[8%] h-[21%] w-[81%] rounded-[4%] border border-white bg-white/40 opacity-10" />
      <div className="absolute top-[27%] left-0 h-[41%] w-[98%] overflow-hidden rounded-[4%] border border-white bg-white/40 shadow-[0_16px_24px_0_rgba(16,25,40,0.24),0_4px_6px_0_rgba(16,25,40,0.12)]">
        <img
          src="/images/auth/patterns/b-notif-card.png"
          alt=""
          className="pointer-events-none absolute max-w-none object-cover"
          style={{ width: "163.65%", height: "900%", left: "-48%", top: "-372%" }}
        />
      </div>
      <div className="absolute top-[55%] left-[80%] size-[13%] rounded-full border-4 border-white bg-[#f1f1f1] shadow-[0_16px_24px_0_rgba(16,25,40,0.24),0_4px_6px_0_rgba(16,25,40,0.12)]">
        <img src="/images/auth/patterns/b-bell-1.svg" alt="" className="absolute inset-0 size-full" />
        <img src="/images/auth/patterns/b-bell-2.svg" alt="" className="absolute inset-[27%_26%_26%_26%] size-auto" />
        <img src="/images/auth/patterns/b-bell-3.svg" alt="" className="absolute inset-[55%_25%_20%_25%] size-auto" />
      </div>
    </CenteredCollage>
  );
}

/** Pattern C — password / security mockup card. forgot-password request, new-password, success. */
export function PasswordMockupCollage() {
  return (
    <CenteredCollage aspect="418/300">
      <div className="absolute top-[6%] left-[4%] h-[21%] w-[89%] rounded-[4%] border border-white bg-white/40 opacity-50" />
      <div className="absolute top-0 left-[8%] h-[63%] w-[89%] overflow-hidden rounded-[4%] border border-white bg-white/40 shadow-[0_16px_24px_0_rgba(16,25,40,0.24),0_4px_6px_0_rgba(16,25,40,0.12)]">
        <img
          src="/images/auth/patterns/c-card.png"
          alt=""
          className="pointer-events-none absolute max-w-none object-cover"
          style={{ width: "112%", height: "180%", left: "-6%", top: "-16%" }}
        />
      </div>
      <PointerArrow
        src="/images/auth/arrow-c.svg"
        rotate="157.52deg"
        className="top-[58%] left-[69%] h-[13%] w-[12%]"
      />
      <AvatarBubble className="top-[63%] left-[73%]" src="/images/auth/avatar-c.jpg" size="w-[13%]" />
    </CenteredCollage>
  );
}

/** Pattern D — floating pill badges (OKR/Strategy/Performance). Onboarding: goal step. */
export function GoalPillsCollage() {
  return (
    <CenteredCollage aspect="496/255">
      <PillBadge className="top-[6%] left-[55%]" blurred>OKR Alignment</PillBadge>
      <PillBadge className="top-[28%] left-[20%]" blurred>OKR Alignment</PillBadge>
      <PillBadge className="top-[57%] left-[54%]" blurred>Performance Evidence</PillBadge>
      <PillBadge className="top-[77%] left-[31%]" blurred>Strategy Execution</PillBadge>
      <PillBadge className="top-[24%] left-[2%]">Strategy Execution</PillBadge>
      <PillBadge className="top-[51%] left-[9%]">Performance Evidence</PillBadge>
      <PillBadge className="top-[36%] left-[39%]">OKR Alignment</PillBadge>
      <AvatarBubble className="top-0 left-[27%]" src="/images/auth/avatar-a.jpg" size="w-[10%]" />
      <PointerArrow src="/images/auth/arrow-a.svg" rotate="170.44deg" className="top-[13%] left-[24%] h-[13%] w-[9%]" />
      <AvatarBubble className="top-[73%] left-[8%]" src="/images/auth/avatar-b.jpg" size="w-[10%]" />
      <PointerArrow src="/images/auth/arrow-b.svg" rotate="-86.6deg" className="top-[63%] left-[15%] h-[13%] w-[9%]" />
      <AvatarBubble className="top-[50%] left-[58%]" src="/images/auth/avatar-c.jpg" size="w-[10%]" />
      <PointerArrow src="/images/auth/arrow-c.svg" rotate="157.52deg" className="top-[40%] left-[54%] h-[13%] w-[9%]" />
    </CenteredCollage>
  );
}

/** Pattern E — floating pill badges around an "Acme Corp" hub. Onboarding: scope step. */
export function ScopePillsCollage() {
  return (
    <CenteredCollage aspect="479/232">
      <PillBadge className="top-[12%] left-[7%]">Product</PillBadge>
      <PillBadge className="top-[64%] left-[5%]">Sales</PillBadge>
      <div className="absolute top-[32%] left-[23%] flex items-center gap-2 rounded-full border-2 border-white bg-white p-1 pr-4 shadow-[0_12px_24px_rgba(16,25,40,.2)]">
        <div className="flex size-10 items-center justify-center rounded-full bg-brand-purple-500 text-white"><Building2 className="size-5"/></div>
        <span className="text-sm font-semibold text-brand-grey-700">Acme Corp</span>
      </div>
      <PillBadge className="top-[19%] left-[58%]">Engineering</PillBadge>
      <PillBadge className="top-[71%] left-[52%]">Customer Success</PillBadge>
      <PointerArrow src="/images/auth/arrow-a.svg" rotate="91.11deg" className="top-[20%] left-[18%] h-[15%] w-[10%]" />
      <PointerArrow src="/images/auth/arrow-b.svg" rotate="-86.6deg" className="top-[53%] left-[16%] h-[15%] w-[10%]" />
      <PointerArrow src="/images/auth/arrow-c.svg" rotate="157.52deg" className="top-[27%] left-[51%] h-[15%] w-[10%]" />
    </CenteredCollage>
  );
}

export function TeamScopeCollage() {
  return <CenteredCollage aspect="449/242">
    <div className="absolute inset-x-[5%] top-[5%] h-[72%] rounded-2xl border-2 border-white bg-white/90 shadow-[0_16px_24px_rgba(16,25,40,.2)]">
      <AvatarBubble className="top-[8%] left-[6%]" src="/images/auth/patterns/i-avatar-1.png" size="w-[22%]" />
      <AvatarBubble className="top-[8%] left-[38%]" src="/images/auth/patterns/i-avatar-2.png" size="w-[22%]" />
      <AvatarBubble className="top-[8%] left-[70%]" src="/images/auth/patterns/i-avatar-4.png" size="w-[22%]" />
      <AvatarBubble className="top-[51%] left-[22%]" src="/images/auth/avatar-b.jpg" size="w-[22%]" />
      <AvatarBubble className="top-[51%] left-[54%]" src="/images/auth/avatar-c.jpg" size="w-[22%]" />
    </div>
    <PillBadge className="top-0 left-[18%]">Sarah</PillBadge>
    <PillBadge className="top-[69%] left-[8%]">John</PillBadge>
    <PillBadge className="top-[35%] left-[66%]">You</PillBadge>
    <PointerArrow src="/images/auth/arrow-a.svg" rotate="91.11deg" className="top-[10%] left-[15%] h-[14%] w-[9%]" />
    <PointerArrow src="/images/auth/arrow-b.svg" rotate="-86.6deg" className="top-[61%] left-[18%] h-[14%] w-[9%]" />
    <PointerArrow src="/images/auth/arrow-c.svg" rotate="157.52deg" className="top-[30%] left-[63%] h-[14%] w-[9%]" />
  </CenteredCollage>;
}

/** Pattern F — org icon + dashed connector + input pill rows. Onboarding: org details step. */
export function OrgDetailsCollage() {
  return (
    <CenteredCollage aspect="371/350">
      <div className="absolute left-0 top-0 size-[31%] rotate-[1.12deg] overflow-hidden rounded-full border border-white bg-white/40 p-[5px] shadow-xl"><div className="relative size-full overflow-hidden rounded-full"><img src="/images/auth/patterns/f-org-details.png" alt="" className="absolute h-[436%] w-[428%] max-w-none" style={{left:"-164%",top:"-58%"}}/></div></div>
      <div className="absolute left-[11%] top-[29%] h-[20%] border-l-2 border-dashed border-white/50"/>
      {[[-1.27,"37%","-655.77%"],[1.12,"59%","-547.02%"],[.72,"81%","-772.01%"]].map(([rotate,top,cropTop],index)=><div key={index} className="absolute left-0 h-[20%] w-full overflow-hidden rounded-[18px] border border-white bg-white/40 p-[5px] shadow-lg" style={{top:String(top),transform:`rotate(${rotate}deg)`}}><div className="relative size-full overflow-hidden rounded-[14px]"><img src="/images/auth/patterns/f-org-details.png" alt="" className="absolute h-[1144%] w-[168.5%] max-w-none" style={{left:"-34.5%",top:String(cropTop)}}/></div></div>)}
    </CenteredCollage>
  );
}

/** Pattern G — Strategy card branching to 3 document cards. Onboarding: business intel step. */
export function BusinessIntelCollage() {
  return (
    <CenteredCollage aspect="500/369">
      <svg className="absolute inset-x-[11%] top-[30%] h-[16%] w-[74%]" viewBox="0 0 370 60" fill="none" aria-hidden="true"><path d="M185 0V18M50 18H320M50 18V60M185 18V60M320 18V60" stroke="rgba(255,255,255,.65)" strokeWidth="2" strokeDasharray="5 6"/><circle cx="185" cy="18" r="7" fill="white" opacity=".8"/></svg>
      <div className="absolute top-0 left-[13%] h-[32%] w-[74%] overflow-hidden rounded-2xl border border-white bg-white/40 shadow-[0_16px_24px_0_rgba(16,25,40,0.24),0_4px_6px_0_rgba(16,25,40,0.12)]">
        <img src="/images/auth/patterns/g-strategy-docs.png" alt="" className="pointer-events-none absolute max-w-none object-cover" style={{ width: "184%", height: "434%", left: "-42%", top: "-66%" }} />
      </div>
      <div className="absolute top-[46%] left-0 h-[38%] w-[26%] overflow-hidden rounded-2xl border border-white bg-white/40 shadow-[0_16px_24px_0_rgba(16,25,40,0.24),0_4px_6px_0_rgba(16,25,40,0.12)]">
        <img src="/images/auth/patterns/g-strategy-docs.png" alt="" className="pointer-events-none absolute max-w-none object-cover" style={{ width: "385%", height: "368%", left: "-142%", top: "-200%" }} />
      </div>
      <div className="absolute top-[46%] left-[37%] h-[38%] w-[26%] overflow-hidden rounded-2xl border border-white bg-white/40 shadow-[0_16px_24px_0_rgba(16,25,40,0.24),0_4px_6px_0_rgba(16,25,40,0.12)]">
        <img src="/images/auth/patterns/g-strategy-docs.png" alt="" className="pointer-events-none absolute max-w-none object-cover" style={{ width: "385%", height: "368%", left: "-27%", top: "-200%" }} />
      </div>
      <div className="absolute top-[46%] left-[74%] h-[38%] w-[26%] overflow-hidden rounded-2xl border border-white bg-white/40 shadow-[0_16px_24px_0_rgba(16,25,40,0.24),0_4px_6px_0_rgba(16,25,40,0.12)]">
        <img src="/images/auth/patterns/g-strategy-docs.png" alt="" className="pointer-events-none absolute max-w-none object-cover" style={{ width: "385%", height: "368%", left: "-254%", top: "-200%" }} />
      </div>
      <PointerArrow src="/images/auth/arrow-c.svg" rotate="-178.46deg" flip={false} className="top-[70%] left-[88%] h-[11%] w-[10%]" />
      <AvatarBubble className="top-[76%] left-[93%]" src="/images/auth/patterns/g-avatar.png" size="w-[13%]" />
    </CenteredCollage>
  );
}

/** Pattern H — Objective/Key Result card mockup. Onboarding: objective step. */
export function ObjectiveCollage() {
  return (
    <CenteredCollage aspect="411/253">
      <div className="absolute top-[3%] left-[8%] h-[91%] w-[67%] overflow-hidden rounded-2xl border-2 border-white bg-white/40 p-[5px] shadow-[0_16px_24px_0_rgba(16,25,40,0.24),0_4px_6px_0_rgba(16,25,40,0.12)]">
        <img
          src="/images/auth/patterns/h-objective-card.png"
          alt=""
          className="pointer-events-none absolute max-w-none object-cover"
          style={{ width: "172%", height: "134%", left: "-34%", top: "-16%" }}
        />
      </div>
      <AvatarBubble className="top-[4%] left-[69%]" src="/images/auth/patterns/h-avatar-1.jpg" size="w-[14%]" />
      <AvatarBubble className="top-[59%] left-[3%]" src="/images/auth/patterns/h-avatar-2.jpg" size="w-[14%]" />
      <AvatarBubble className="top-[51%] left-[67%]" src="/images/auth/patterns/h-avatar-3.jpg" size="w-[14%]" />
      <PointerArrow src="/images/auth/arrow-a.svg" rotate="91.11deg" className="top-[14%] left-[63%] h-[13%] w-[9%]" />
      <PointerArrow src="/images/auth/arrow-b.svg" rotate="-86.6deg" className="top-[57%] left-[12%] h-[13%] w-[9%]" />
    </CenteredCollage>
  );
}

/** Pattern I — teammate avatar grid + "Add teammate" pill. Onboarding: invite step. */
export function InviteCollage() {
  return (
    <CenteredCollage aspect="449/242">
      <div className="absolute inset-x-[4%] top-[4%] h-[76%] overflow-hidden rounded-2xl border-2 border-white bg-white/90 shadow-[0_16px_24px_0_rgba(16,25,40,0.24),0_4px_6px_0_rgba(16,25,40,0.12)]">
        <div className="absolute top-[8%] left-[6%] size-[24%] overflow-hidden rounded-full border-4 border-white shadow-lg">
          <img src="/images/auth/patterns/i-avatar-1.png" alt="" className="size-full object-cover" />
        </div>
        <div className="absolute top-[50%] left-[22%] size-[24%] overflow-hidden rounded-full border-4 border-white shadow-lg">
          <img src="/images/auth/patterns/i-avatar-2.png" alt="" className="size-full object-cover" />
        </div>
        <div className="absolute top-[8%] left-[70%] size-[24%] overflow-hidden rounded-full border-4 border-white shadow-lg">
          <img src="/images/auth/patterns/i-avatar-4.png" alt="" className="size-full object-cover" />
        </div>
        <div className="absolute top-[8%] left-[38%] flex size-[24%] items-center justify-center rounded-full border-4 border-white bg-brand-grey-100 text-brand-grey-400 shadow-lg">
          <Plus className="size-8"/>
        </div>
        <div className="absolute top-[50%] left-[54%] size-[24%] overflow-hidden rounded-full border-4 border-white shadow-lg"><img src="/images/auth/patterns/i-avatar-3.png" alt="" className="size-full object-cover"/></div>
      </div>
      <svg className="absolute top-[31%] left-[42%] h-[16%] w-[13%] drop-shadow-[0_4px_4px_rgba(5,8,21,.25)]" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M8 4L34 15L20 19L16 33L8 4Z" fill="#3B82F6" stroke="#050815" strokeWidth="2" strokeLinejoin="round"/></svg>
      <PillBadge className="top-[43%] left-[46%]">Add teammate</PillBadge>
    </CenteredCollage>
  );
}
