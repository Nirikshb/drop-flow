import type { Metadata } from "next";
import Link from "next/link";

import { Faq, PlanTabs } from "./_components/interactive";

export const metadata: Metadata = {
  title: "Nonlinear Calendar: AI-Powered Scheduling for Modern Product Teams",
  description:
    "A calendar built for product teams that ship. Plan in seconds, defend deep work, and let agents handle the scheduling chaos.",
};

function CalendarMockup() {
  const days = ["MON 12", "TUE 13", "WED 14", "THU 15", "FRI 16"];
  const times = ["9 AM", "11 AM", "1 PM", "3 PM"];
  return (
    <div className="nl-mockup" aria-label="Preview of the Nonlinear calendar interface">
      <div className="nl-mock-bar">
        <span className="nl-dot" /><span className="nl-dot" /><span className="nl-dot" />
        <span className="nl-mock-title">Calendar — Q2 Planning — Home — Focus</span>
      </div>
      <div className="nl-mock-body">
        <aside className="nl-mock-side">
          <div className="nl-side-row">⌕ &nbsp; Quick find</div>
          <div className="nl-side-row on">▦ &nbsp; Calendar</div>
          <div className="nl-side-row">◷ &nbsp; Inbox</div>
          <div className="nl-side-row">◎ &nbsp; Focus</div>
          <div className="nl-side-row">◈ &nbsp; Analytics</div>
          <div className="nl-side-row">⎘ &nbsp; Roadmap</div>
          <div className="nl-side-label">Calendars</div>
          <div className="nl-side-row">● Product</div>
          <div className="nl-side-row">● Engineering</div>
          <div className="nl-side-row">● Design</div>
          <div className="nl-side-row">● Customer calls</div>
          <div className="nl-side-row">● Personal</div>
        </aside>
        <div style={{ position: "relative" }}>
          <div className="nl-cal-head">
            <span>Today &nbsp; ‹ &nbsp; May 12—18, 2026 &nbsp; ›</span>
            <span>Day &nbsp; Week &nbsp; Month &nbsp; Quarter &nbsp; + New event</span>
          </div>
          <div className="nl-cal-grid">
            <div>
              <div style={{ height: 25 }} />
              {times.map((t) => <div className="nl-cal-time" key={t}>{t}</div>)}
            </div>
            {days.map((day, i) => (
              <div className="nl-cal-col" key={day}>
                <div className="nl-day">{day}</div>
                {i === 0 && <><div className="nl-event nl-ev-green">Standup<br />9:30 – 9:45</div><div className="nl-event nl-ev-gray">Design review<br />11:00 – 12:00</div></>}
                {i === 1 && <><div className="nl-event nl-ev-orange">Stanley / fix<br />10:00 – 11:00</div><div className="nl-event nl-ev-blue">Linear Discovery<br />1:00 – 2:00</div></>}
                {i === 2 && <><div className="nl-event nl-ev-orange">Game jam<br />10:00 – 12:00</div><div className="nl-event nl-ev-gray">Team sync<br />2:00 – 3:00</div></>}
                {i === 3 && <><div className="nl-event nl-ev-green">API review<br />10:00 – 11:00</div><div className="nl-event nl-ev-orange">Q2 Planning<br />2:00 – 3:00</div><div className="nl-event nl-ev-gray">Deep work<br />3:00 – 5:00</div></>}
                {i === 4 && <><div className="nl-event nl-ev-green">Standup $20<br />10:00 – 11:00</div><div className="nl-event nl-ev-gray">Reading<br />1:00 – 2:00</div></>}
              </div>
            ))}
          </div>
          <div className="nl-ai-card">
            <div className="nl-ai-badge">✦ &nbsp; AGENT ARIA</div>
            <p style={{ margin: "8px 0 0", lineHeight: 1.5 }}>
              More startups at 9:45 to fix a 90-min focus block before 12:00. Work on it today?
            </p>
            <span className="nl-ai-btn">Apply · 15m</span>
            <span style={{ marginLeft: 8, color: "#777" }}>Dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  { title: "Built for flow", text: "Block out deep work that meetings can't break into. Nonlinear learns when you ship best and protects those hours." },
  { title: "Powered by agents", text: "Aria handles reschedules, sends invites, drafts prep notes — and keeps your week loaded with the right meetings." },
  { title: "Plans around you", text: "Drag a task onto the week and it finds the right slot, then reshuffles everything when plans change." },
  { title: "One surface", text: "Calendar, planner, focus timer and scheduling links woven together instead of scattered across tabs." },
];

const views = [
  { name: "Day", text: "A single day, hour by hour. The view you live in when you're shipping." },
  { name: "Week", text: "Plan around your team's rhythm. The default for most product folks." },
  { name: "Month", text: "Zoom out to spot overload, find gaps, and plan the long arcs of work." },
  { name: "Quarter", text: "A roadmap that breathes. See the shape of a quarter before it happens." },
];

const posts = [
  { tag: "Guide", title: "The Async-First Playbook for Modern Teams", author: "Naomi Schwartz" },
  { tag: "News", title: "How to Schedule Meetings Across Time Zones Without the Headache", author: "Naomi Schwartz" },
  { tag: "Report", title: "Deep Work in the Age of Slack: A Practical Framework", author: "Naomi Schwartz" },
];

export default function NonlinearNewPage() {
  return (
    <>
      <header className="nl-wrap">
        <nav className="nl-nav">
          <div className="nl-brand"><span className="nl-brand-mark" />Nonlinear</div>
          <div className="nl-menu" aria-label="Menu"><span /><span /><span /></div>
        </nav>
      </header>

      <main>
        <section className="nl-wrap nl-hero">
          <h1 className="nl-h1">The calendar, rebuilt for people who ship.</h1>
          <p className="nl-lead">
            A calendar built for product teams that ship. Plan in seconds, defend deep work, and let agents handle the scheduling chaos.
          </p>
          <div className="nl-hero-actions">
            <Link className="nl-btn" href="#early-access">Start scheduling →</Link>
            <Link className="nl-btn nl-btn-ghost" href="#how-it-works">See planning in action</Link>
          </div>
          <CalendarMockup />
        </section>

        <div className="nl-logos">
          <span>linear</span><span>vercel</span><span>figma</span><span>notion</span><span>raycast</span><span>mercury</span>
        </div>

        <section className="nl-wrap nl-section">
          <div className="nl-feature-hero">
            <h2 className="nl-h2">Time is the only resource you can&apos;t earn back.</h2>
            <p className="nl-lead">
              Nonlinear treats it that way — built for product teams who measure shipping in hours, not weeks.
            </p>
          </div>
          <div className="nl-grid-2">
            {features.map((f) => (
              <article className="nl-card" key={f.title}>
                <h3 className="nl-card-title">{f.title}</h3>
                <p className="nl-card-text">{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="nl-wrap nl-section" id="how-it-works">
          <div className="nl-section-head">
            <h2 className="nl-h2">Everything you need to ship the week.</h2>
            <p className="nl-lead">
              A calendar, planner, focus timer, scheduling link, and AI agent — woven into a single surface that moves at the speed of your team.
            </p>
          </div>
          <PlanTabs />
        </section>

        <section className="nl-wrap nl-section">
          <h2 className="nl-h2" style={{ textAlign: "center", marginBottom: 50 }}>Calendar work, back of mind.</h2>
          <div className="nl-stats">
            <div className="nl-stat">
              <div className="nl-stat-num">−87<span style={{ fontSize: "0.5em" }}>%</span></div>
              <div className="nl-stat-label">Reschedules</div>
              <p className="nl-stat-text">Aria absorbs reschedule chaos before it lands in your inbox.</p>
            </div>
            <div className="nl-stat">
              <div className="nl-stat-num">+1.4</div>
              <div className="nl-stat-label">Daily focus · hours</div>
              <p className="nl-stat-text">Median focused time per person, per day. Defended.</p>
            </div>
            <div className="nl-stat">
              <div className="nl-stat-num">8×</div>
              <div className="nl-stat-label">Time to schedule</div>
              <p className="nl-stat-text">From “let&apos;s find a time” to a sent invite. Measured against the old way.</p>
            </div>
          </div>
        </section>

        <section className="nl-wrap nl-section">
          <div className="nl-feature-hero">
            <h2 className="nl-h3">Wake up to a calmer week.</h2>
            <p className="nl-lead">
              While you&apos;re asleep, Aria prepares the day — accepts low-stakes invites, drafts meeting prep, and flags conflicts before they hit your inbox. You wake up to a briefing, not a backlog.
            </p>
          </div>
          <div className="nl-grid-3">
            {["Overnight summary", "Prep on demand", "At-risk alerts"].map((title, i) => (
              <article className="nl-card" key={title}>
                <div className="nl-panel-art" style={{ height: 80, marginBottom: 20 }} aria-hidden="true" />
                <h3 className="nl-card-title">{String(i + 1).padStart(2, "0")} — {title}</h3>
                <p className="nl-card-text">
                  {[
                    "A short briefing of what changed while you were away, and what deserves your attention first.",
                    "Everything you need for the next meeting, gathered from docs, issues and threads.",
                    "Conflicts, overload and missed commitments flagged early — before they become fires.",
                  ][i]}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="nl-wrap nl-section">
          <div className="nl-section-head">
            <h2 className="nl-h2">Every view, one workspace.</h2>
            <p className="nl-lead">
              The same data, the same keyboard, the same surfaces — at any time scale. Zoom from a single afternoon to a quarter without losing your place.
            </p>
          </div>
          <div className="nl-grid-4">
            {views.map((v) => (
              <article className="nl-view" key={v.name}>
                <div className="nl-view-art" aria-hidden="true">
                  <div className="nl-view-bar a" /><div className="nl-view-bar b" /><div className="nl-view-bar c" />
                </div>
                <h3 className="nl-card-title">{v.name}</h3>
                <p className="nl-card-text">{v.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="nl-wrap nl-section">
          <div className="nl-section-head">
            <h3 className="nl-h3">What our customers say</h3>
            <p className="nl-lead">See real testimonials from teams that shipped more by scheduling less.</p>
          </div>
          <div className="nl-grid-2">
            <article className="nl-card">
              <p className="nl-quote">
                “Nonlinear Calendar has revolutionized our team&apos;s scheduling process. The AI-powered scheduling feature saves us hours each week, and the integration with our existing tools is seamless.”
              </p>
              <div className="nl-person"><div className="nl-avatar">EC</div><div><div className="nl-person-name">Emily Chen</div><div className="nl-person-role">Product Manager at Zenith</div></div></div>
            </article>
            <article className="nl-card">
              <p className="nl-quote">
                “Since switching, our team&apos;s productivity has increased by 30%. Customizable views and real-time sharing mean we spend our time building, not coordinating.”
              </p>
              <div className="nl-person"><div className="nl-avatar">MR</div><div><div className="nl-person-name">Marcus Reyes</div><div className="nl-person-role">Engineering Lead at Northstar</div></div></div>
            </article>
          </div>
        </section>

        <section className="nl-wrap nl-section">
          <div className="nl-section-head">
            <h2 className="nl-h2">Latest articles from our blog</h2>
            <p className="nl-lead">Learn how to increase your productivity with calendars.</p>
          </div>
          <div className="nl-grid-3">
            {posts.map((post) => (
              <Link className="nl-blog-card" href="/resourcesnew" key={post.title}>
                <div className="nl-blog-art" />
                <div className="nl-blog-body">
                  <div className="nl-tag">{post.tag}</div>
                  <h3 className="nl-card-title" style={{ marginTop: 12 }}>{post.title}</h3>
                  <p className="nl-card-text" style={{ marginTop: 10 }}>This is the title of the post which is going to be long.</p>
                  <p style={{ color: "#777", fontSize: 11, marginTop: 18 }}>{post.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="nl-wrap nl-section">
          <div className="nl-section-head"><h3 className="nl-h3">Frequently asked questions.</h3></div>
          <Faq />
        </section>

        <section className="nl-wrap nl-final" id="early-access">
          <h2 className="nl-h2">Built for the time you can&apos;t get back.</h2>
          <p className="nl-lead" style={{ marginLeft: "auto", marginRight: "auto" }}>
            A calendar built for product teams that ship. Plan in seconds, defend deep work, and let agents handle the scheduling chaos.
          </p>
          <div className="nl-hero-actions">
            <Link className="nl-btn" href="/signupnew">Get early access →</Link>
            <Link className="nl-btn nl-btn-ghost" href="/homenew">Back to Dropflow templates</Link>
          </div>
          <p style={{ color: "#666", fontSize: 11, marginTop: 22 }}>Design template preview — no payment is collected and no data is stored.</p>
        </section>
      </main>

      <footer className="nl-wrap nl-footer">
        <div className="nl-brand"><span className="nl-brand-mark" />Nonlinear</div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Link href="/pricingnew">Pricing</Link><Link href="/privacypolicynew">Privacy</Link><Link href="/termsnew">Terms</Link><Link href="/homenew">Dropflow templates</Link>
        </div>
        <span>Design study — template by Dropflow</span>
      </footer>
    </>
  );
}
