
"use client";

import { useEffect, useState } from "react";

const KEY = "mufasa:preloaded";
const MAX_MS = 12000;

// [side, offset, top, size]
const STARS: ["l" | "r", number, number, number][] = [
  ["l", 20, 10, 2], ["l", 80, 70, 2], ["l", 35, 90, 2], ["l", 140, 30, 2], ["l", 40, 50, 2],
  ["l", 90, 20, 3], ["l", 70, 120, 3], ["r", 70, 90, 2], ["r", 10, 50, 3], ["r", 90, 40, 3],
  ["r", 45, 20, 3], ["r", 60, 120, 3], ["r", 50, 60, 3], ["r", 120, 10, 3],
];

const STRIPES = [
  [10, 0, 20, 3], [20, 3, 31, 4], [31, 4, 44, 4],
  [44, 4, 58, 5], [58, 5, 75, 8], [75, 8, 97, 9], [97, 9, 120, 9],
];

function TailLight({ side }: { side: 0 | 1 }) {
  return (
    <div className={`pl-tl pl-tl${side}`}>
      <i className="a" />
      <i className="b" />
      <i className="c" />
      <i className="d" />
      <b className="cage-top" />
      <b className="cage-bottom" />
    </div>
  );
}

export function Preloader({
  minDuration = 4000,
  oncePerSession = true,
  tone = "mufasa",
}: {
  minDuration?: number;
  oncePerSession?: boolean;
  tone?: "mufasa" | "synthwave";
}) {
  const [phase, setPhase] = useState<"show" | "exit" | "gone">("show");
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (oncePerSession) {
      try {
        if (sessionStorage.getItem(KEY)) {
          setPhase("gone");
          return;
        }
      } catch {
        // Storage unavailable
      }
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minMs = reduce ? 400 : minDuration;

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const t0 = performance.now();

    let loaded = document.readyState === "complete";
    let shown = 0;
    let last = -1;
    let raf = 0;
    let timer = 0;
    let finished = false;

    const onLoad = () => {
      loaded = true;
    };

    window.addEventListener("load", onLoad);

    const finish = () => {
      if (finished) return;

      finished = true;
      setPct(100);
      html.style.overflow = prevOverflow;

      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        // Storage unavailable
      }

      setPhase("exit");
      timer = window.setTimeout(() => setPhase("gone"), 900);
    };

    const tick = (now: number) => {
      const elapsed = now - t0;
      const byTime = Math.min(100, (elapsed / minMs) * 100);
      const target = Math.min(byTime, loaded ? 100 : 90);

      shown += (target - shown) * 0.12;

      const value = Math.min(99, Math.round(shown));

      if (value !== last) {
        last = value;
        setPct(value);
      }

      if ((loaded && elapsed >= minMs && shown > 98) || elapsed > MAX_MS) {
        finish();
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener("load", onLoad);

      if (!finished) {
        html.style.overflow = prevOverflow;
      }
    };
  }, [minDuration, oncePerSession]);

  if (phase === "gone") return null;

  return (
    <div
      className={`pl-root${phase === "exit" ? " pl-exit" : ""}`}
      data-tone={tone}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${pct}%`}
    >
      <style>{CSS}</style>
      <noscript>
        <style>{".pl-root{display:none!important}"}</style>
      </noscript>

      <p className="pl-label pl-tl-label font-display">Buckle up</p>
      <p className="pl-label pl-tr-label mono-label">
       lets take a ride
      </p>

      <div className="pl-stage" aria-hidden="true">
        <div className="pl-scene">
          <div className="pl-stars">
            {STARS.map(([side, x, y, s], i) => (
              <i
                key={i}
                style={{
                  [side === "l" ? "left" : "right"]: x,
                  top: y,
                  width: s,
                  height: s,
                }}
              />
            ))}
          </div>

          <div className="pl-sun">
            <div className="pl-ball" />
            {STRIPES.map(([t0, h0, t1, h1], i) => (
              <div
                key={i}
                className="pl-stripe"
                style={{
                  ["--t0" as string]: `${t0}px`,
                  ["--h0" as string]: `${h0}px`,
                  ["--t1" as string]: `${t1}px`,
                  ["--h1" as string]: `${h1}px`,
                }}
              />
            ))}
          </div>

          <div className="pl-hill pl-hill-r" />
          <div className="pl-hill pl-hill-l" />

          {(["a", "b"] as const).map((k) => (
            <div key={k} className={`pl-tree pl-tree-${k}`}>
              <svg viewBox="0 0 100 150" width="100%" height="100%">
                <path
                  d="M50 4 72 44H61L82 80H68L92 120H56V146H44V120H8L32 80H18L39 44H28Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          ))}

          <div className="pl-fog" />
          <div className="pl-land" />

          <div className="pl-side pl-side-l">
            <div className="pl-grid" style={{ ["--rz" as string]: "10deg" }} />
          </div>

          <div className="pl-side pl-side-r">
            <div className="pl-grid" style={{ ["--rz" as string]: "-10deg" }} />
          </div>

          <div className="pl-road">
            <div className="pl-lines">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className={i === 0 ? "pl-line pl-line0" : "pl-line"}
                />
              ))}
            </div>
          </div>

          <div className="pl-car">
            <div className="pl-sec" />

            <div className="pl-sec pl-lights-sec">
              <div className="pl-lights0" />
              <div className="pl-lights1" />
              <div className="pl-lights2">
                <TailLight side={0} />
                <div />
                <TailLight side={1} />
              </div>

              <div className="pl-logo" />
              <div className="pl-window" />
              <div className="pl-sunref" />

              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`pl-stripe-light pl-sl${i}`} />
              ))}
            </div>

            <div className="pl-sec">
              <div className="pl-bumper0" />
              <div className="pl-bumper1" />
              <div className="pl-bumper2" />

              <div className="pl-bumper3">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} />
                ))}
              </div>

              <div className="pl-exhaust pl-ex0" />
              <div className="pl-exhaust pl-ex1" />

              <div className="pl-plate">OGINGA</div>
            </div>
          </div>

          <div className="pl-fog2" />
          <div className="pl-cutout" />
        </div>
      </div>

      <p className="pl-label pl-bl-label mono-label">LOADING</p>
      <p className="pl-label pl-br-label font-display">
        {String(pct).padStart(3, "0")}
      </p>
    </div>
  );
}

const CSS = `
.pl-root{--pl-bg:#080808;--pl-ink:#ECE7DC;--pl-accent:#FD802E;--pl-sky:#17110f;--pl-sun:#FD802E;--pl-fog:rgba(253,128,46,.55);--pl-fog2:rgba(253,128,46,.2);--pl-land:#0c0908;--pl-grid:#FD802E;--pl-line:#ECE7DC;--pl-sil:#0a0706;--pl-tail:#ff2a1a;
position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:var(--pl-bg);color:var(--pl-ink);clip-path:inset(0 0 0 0);transition:clip-path .85s cubic-bezier(.76,0,.24,1)}
.pl-root[data-tone="synthwave"]{--pl-bg:#131313;--pl-ink:#fff;--pl-accent:#2afce0;--pl-sky:#2e0d3f;--pl-sun:#fbe54f;--pl-fog:#b811c6;--pl-fog2:#b711c63f;--pl-land:#120b12;--pl-grid:#2afce0;--pl-line:#fcff1a;--pl-sil:#190a21}
.pl-root.pl-exit{clip-path:inset(0 0 100% 0);pointer-events:none}
.pl-label{position:absolute;margin:0;font-size:11px;letter-spacing:.3em}
.pl-tl-label{top:24px;left:24px;font-size:18px;letter-spacing:0;font-weight:700}
.pl-tr-label{top:28px;right:24px;opacity:.6}
.pl-bl-label{bottom:28px;left:24px;opacity:.6}
.pl-br-label{bottom:20px;right:24px;font-size:clamp(2.5rem,7vw,5rem);line-height:1;letter-spacing:-.02em;font-weight:700;color:var(--pl-accent)}
.pl-stage{width:300px;height:250px;transform:scale(1.15)}
@media(min-width:768px){.pl-stage{transform:scale(1.6)}}
@media(min-width:1280px){.pl-stage{transform:scale(1.9)}}
.pl-scene{position:relative;width:300px;height:250px;background:var(--pl-sky)}
.pl-scene *{box-sizing:content-box}
.pl-stars{position:absolute;inset:0}
.pl-stars i{position:absolute;background:#fff;border-radius:50%}
.pl-sun{overflow:hidden;width:120px;height:120px;position:absolute;top:50%;left:50%;transform:translate(-50%,-70%)}
.pl-ball{width:120px;height:120px;border-radius:50%;background:var(--pl-sun)}
.pl-stripe{position:absolute;left:0;width:100%;background:var(--pl-sky);top:var(--t0);height:var(--h0);animation:pl-stripe 1s linear infinite}
@keyframes pl-stripe{0%{top:var(--t0);height:var(--h0)}99%{top:var(--t1);height:var(--h1)}100%{top:var(--t0);height:var(--h0)}}
.pl-hill{position:absolute;top:62px;width:92px;height:78px;background:var(--pl-sil);clip-path:polygon(0 100%,14% 62%,28% 74%,52% 8%,70% 48%,84% 34%,100% 100%)}
.pl-hill-r{right:34px}.pl-hill-l{left:34px;transform:scaleX(-1)}
.pl-tree{position:absolute;width:120px;height:120px;bottom:65px;color:var(--pl-sil);transform-origin:50% 70%}
.pl-tree-a{left:55%;transform:translateX(-100%);animation:pl-sway-a 4s infinite}
.pl-tree-b{right:55%;transform:translateX(100%) scaleX(-1) rotate(8deg);animation:pl-sway-b 4s .5s infinite}
@keyframes pl-sway-a{0%,100%{transform:translateX(-100%) rotate(8deg)}50%{transform:translateX(-100%) rotate(-8deg)}}
@keyframes pl-sway-b{0%,100%{transform:translateX(100%) scaleX(-1) rotate(8deg)}50%{transform:translateX(100%) scaleX(-1) rotate(-8deg)}}
.pl-fog{position:absolute;top:50px;width:100%;height:80%;background-image:linear-gradient(transparent,var(--pl-fog))}
.pl-fog2{position:absolute;top:149px;width:300px;height:500px;background-image:linear-gradient(transparent,var(--pl-fog2));transform:rotate(180deg)}
.pl-land{position:absolute;bottom:0;width:100%;height:40%;background:var(--pl-land)}
.pl-side{position:absolute;width:170px;height:830px;perspective:800px;bottom:-338px}
.pl-side-l{left:-70px}.pl-side-r{right:-70px}
.pl-grid{width:100%;height:100%;border:3px solid var(--pl-grid);background:linear-gradient(to right,var(--pl-grid) 1px,transparent 1px) 0 0/20px 20px,linear-gradient(to bottom,var(--pl-grid) 1px,var(--pl-land) 1px) 0 0/20px 20px;transform:rotateX(85deg) rotateZ(var(--rz));transform-origin:center;box-shadow:0 10px 20px rgba(0,0,0,.3);animation:pl-grid .2s linear infinite}
@keyframes pl-grid{0%{transform:rotateX(85deg) rotateZ(var(--rz)) translateY(0)}100%{transform:rotateX(85deg) rotateZ(var(--rz)) translateY(20px)}}
.pl-road{perspective:800px;position:absolute;left:50%;transform:translateX(-50%);bottom:-425px;width:6px;height:1000px}
.pl-lines{transform:rotateX(85deg);transform-origin:center;display:grid;grid-template-rows:repeat(8,1fr);row-gap:30px;width:100%;height:100%;box-shadow:0 10px 20px rgba(252,255,26,.2)}
.pl-line{border-radius:20px;background:var(--pl-line);animation:pl-line .5s linear infinite}
.pl-line0{animation-name:pl-line0}
@keyframes pl-line{to{transform:translateY(130px)}}
@keyframes pl-line0{0%{height:0}100%{transform:translateY(130px);height:100%}}

.pl-car{
position:absolute;
display:grid;
grid-template-rows:repeat(3,1fr);
height:50%;
width:55%;
left:50%;
bottom:-120px;
transform:translateX(-50%) scale(.65);
transform-origin:center bottom;
opacity:0;
animation:pl-car-drive 7s ease-in-out infinite;
will-change:transform,bottom,opacity;
}

@keyframes pl-car-drive{
0%{bottom:-120px;transform:translateX(-50%) scale(.65);opacity:0}
12%{bottom:0;transform:translateX(-50%) scale(1);opacity:1}
20%{bottom:0;transform:translateX(-50%) scale(1);opacity:1}
23%{transform:translateX(calc(-50% - 1px)) translateY(-1px) scale(1.015)}
26%{transform:translateX(calc(-50% + 1px)) translateY(1px) scale(1.025)}
29%{transform:translateX(calc(-50% - 1px)) translateY(-1px) scale(1.015)}
32%{transform:translateX(-50%) translateY(0) scale(1)}
38%{bottom:0;transform:translateX(-50%) scale(1);opacity:1}
65%{bottom:100px;transform:translateX(-50%) scale(.55);opacity:1}
78%{bottom:170px;transform:translateX(-50%) scale(.18);opacity:.65}
88%{bottom:220px;transform:translateX(-50%) scale(.04);opacity:0}
100%{bottom:-120px;transform:translateX(-50%) scale(.65);opacity:0}
}

.pl-sec{position:relative;perspective:800px}
.pl-lights-sec{z-index:2}
.pl-lights0{position:absolute;width:123px;height:5px;background:rgb(115,115,115);left:50%;transform:translate(-50%);bottom:-1px}
.pl-lights1{position:absolute;width:75%;height:100%;background:gray;left:50%;transform:translate(-50%);bottom:4px;clip-path:polygon(0 100%,100% 100%,80% 0,20% 0)}
.pl-lights2{border:2px solid #000;bottom:5px;position:absolute;background:#000;left:50%;transform:translate(-50%);height:15px;width:112px;clip-path:polygon(0 100%,100% 100%,93% 0,7% 0);display:grid;grid-template-columns:35px 1fr 35px}
.pl-tl{background:rgba(255,255,0,.46);position:relative}
.pl-tl0{clip-path:polygon(2% 100%,100% 100%,100% 0,20% 0)}
.pl-tl1{clip-path:polygon(0 100%,98% 100%,80% 0,0 0)}
.pl-tl i{position:absolute;height:100%}
.pl-tl .a{width:29px;background:rgba(75,75,0,.658)}.pl-tl .b{width:23px;background:gray}.pl-tl .c{width:19px;background:rgb(50,0,0)}.pl-tl .d{width:5px;background:rgb(116,0,0)}
.pl-tl0 .a{right:0;clip-path:polygon(0 100%,100% 100%,100% 0,5% 0)}.pl-tl0 .b{right:0;clip-path:polygon(0 100%,100% 100%,100% 0,5% 0)}.pl-tl0 .c{right:4px;clip-path:polygon(0 100%,100% 100%,100% 0,5% 0)}.pl-tl0 .d{right:10px}
.pl-tl1 .a{left:0;clip-path:polygon(0 100%,100% 100%,95% 0,0 0)}.pl-tl1 .b{left:0;clip-path:polygon(0 100%,100% 100%,95% 0,0 0)}.pl-tl1 .c{left:4px;clip-path:polygon(0 100%,100% 100%,95% 0,0 0)}.pl-tl1 .d{left:10px}
.pl-tl b{position:absolute;width:100%;height:1px;background:#000}.pl-tl .cage-top{top:3px}.pl-tl .cage-bottom{bottom:3px}
.pl-logo{position:absolute;left:50%;transform:translate(-50%);background:rgb(18,18,18);width:25px;height:8px;border-radius:2px;bottom:8px}
.pl-window{background:#000;height:20px;position:absolute;width:82px;left:50%;transform:translate(-50%);clip-path:polygon(0 100%,100% 100%,93% 0,7% 0);top:-5px}
.pl-sunref{background:var(--pl-sun);height:5px;position:absolute;width:66px;left:50%;transform:translate(-50%);clip-path:polygon(0 100%,100% 100%,98% 0,2% 0);top:-3px;filter:blur(3px);border-radius:50%}
.pl-stripe-light{position:absolute;background:var(--pl-tail);width:5px;height:70px;filter:blur(6px);border-radius:50%;top:-5px;animation:pl-blink 2s infinite}
.pl-sl0,.pl-sl1{left:49px;animation-delay:1s}.pl-sl2,.pl-sl3{right:49px}
.pl-sl0,.pl-sl2{transform:rotate(30deg)}.pl-sl1,.pl-sl3{transform:rotate(-30deg)}
@keyframes pl-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
.pl-bumper0{clip-path:polygon(5% 100%,95% 100%,100% 0,0 0);background:gray;position:absolute;left:50%;top:0;transform:translate(-50%);width:74%;height:25px}
.pl-bumper1{background:#000;position:absolute;left:50%;top:1px;transform:translate(-50%);width:121px;height:30%;clip-path:polygon(2% 100%,98% 100%,100% 0,0 0)}
.pl-bumper2{background:#000;position:absolute;left:50%;bottom:12px;transform:translate(-50%);width:110px;height:6px}
.pl-bumper3{position:absolute;left:50%;bottom:23px;transform:translate(-50%);width:100px;height:2px;display:grid;grid-template-columns:repeat(8,1fr);column-gap:5px}
.pl-bumper3 div{background:#000;border-radius:10px}
.pl-exhaust{position:absolute;width:10px;height:10px;background:#000;border-radius:50%;bottom:10px}
.pl-ex0{left:25%}.pl-ex1{right:25%}
.pl-exhaust::before{content:"";position:absolute;left:50%;top:70%;transform:translate(-50%,-50%);width:7px;height:9px;background:gray;border-radius:30%;bottom:8px}

.pl-plate{
position:absolute;
z-index:5;
left:50%;
bottom:1px;
transform:translateX(-50%);
width:48px;
height:11px;
line-height:11px;
text-align:center;
border-radius:2px;
background:#f5c518;
color:#111;
border:1px solid #111;
font:900 7px/11px "Arial Black",Verdana,sans-serif;
letter-spacing:1px;
box-shadow:0 0 5px rgba(245,197,24,.35);
}

.pl-cutout{position:absolute;width:100%;height:100%;overflow:hidden;pointer-events:none}
.pl-cutout::before{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:260px;height:225px;border-radius:20px;box-shadow:0 0 0 1000px var(--pl-bg)}
@media (prefers-reduced-motion:reduce){.pl-root *{animation:none!important}.pl-root{transition-duration:.01s}}
`;
