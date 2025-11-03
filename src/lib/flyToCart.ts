export default function flyToCart(imageSrc: string, fromRect: DOMRect | null) {
  try {
    if (!fromRect) return;
    const cartEl = document.querySelector('[data-cart-icon]');
    const toRect = cartEl
      ? cartEl.getBoundingClientRect()
      : ({ x: window.innerWidth - 48, y: 24, width: 32, height: 32 } as DOMRect);

    const img = document.createElement("img");
    img.src = imageSrc;
    img.style.position = "fixed";
    img.style.left = `${fromRect.left}px`;
    img.style.top = `${fromRect.top}px`;
    img.style.width = `${fromRect.width}px`;
    img.style.height = `${fromRect.height}px`;
    img.style.objectFit = "cover";
    img.style.borderRadius = "8px";
    img.style.zIndex = "9999";
    img.style.pointerEvents = "none";
    // subtle shadow for polish
    img.style.boxShadow = "0 12px 30px rgba(0,0,0,0.25)";

    document.body.appendChild(img);

    const destX = toRect.left + toRect.width / 2 - fromRect.width / 2;
    const destY = toRect.top + toRect.height / 2 - fromRect.height / 2;

    const keyframes: Keyframe[] = [
      { transform: `translate(0px, 0px) scale(1) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${destX - fromRect.left}px, ${destY - fromRect.top}px) scale(0.18) rotate(20deg)`, opacity: 0.85 },
    ];

    const anim = img.animate(keyframes, {
      duration: 700,
      easing: "cubic-bezier(.2,.8,.2,1)",
    });

    // play a short pop sound using WebAudio (no external file)
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.value = 0.02;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        try { osc.stop(); } catch (e) {}
        try { ctx.close(); } catch (e) {}
      }, 120);
    } catch (e) {
      // ignore audio errors
    }

    anim.onfinish = () => {
      try {
        img.remove();
      } catch (e) {}
      // small pulse on cart icon at the end for extra feedback
      try {
        if (cartEl) {
          cartEl.animate(
            [
              { transform: "scale(1)", boxShadow: "0 0 0 rgba(0,0,0,0)" },
              { transform: "scale(1.12)", boxShadow: "0 8px 20px rgba(0,0,0,0.12)" },
              { transform: "scale(1)", boxShadow: "0 0 0 rgba(0,0,0,0)" },
            ],
            { duration: 300, easing: "ease-out" }
          );
        }
      } catch (e) {}
    };
  } catch (e) {
    // fail silently
    console.error(e);
  }
}
