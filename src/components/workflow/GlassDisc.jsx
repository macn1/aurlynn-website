function GlassDisc({ index, kind, icon, className = "", style }) {
  return <div
    data-disc={index}
    data-state="future"
    className={`absolute will-change-transform ${className}`}
    style={{ ...style, animation: `disc-float ${7 + index * 0.9}s ease-in-out ${index * -1.3}s infinite` }}
  >
      <div
    data-disc-body
    className="relative size-full rounded-[50%] border border-[#e0c3a0]/70 bg-[radial-gradient(ellipse_at_32%_22%,rgba(255,255,255,0.95),rgba(255,244,232,0.7)_42%,rgba(240,214,190,0.55)_100%)] shadow-[inset_-10px_0_24px_rgba(212,170,125,0.28),inset_6px_0_16px_rgba(255,255,255,0.9),0_30px_40px_-24px_rgba(150,100,60,0.45)]"
  >
        {
    /* champagne rim on the lit edge */
  }
        <div className="absolute inset-0 rounded-[50%] shadow-[inset_-3px_0_0_rgba(214,168,118,0.55)]" aria-hidden />
        <div
    data-disc-glow
    aria-hidden
    className="absolute inset-[18%] rounded-[50%] bg-[radial-gradient(circle,rgba(255,196,130,0.65),transparent_70%)] opacity-0 blur-md"
  />
        <div
    data-disc-icon
    data-kind={kind}
    className="absolute inset-0 flex items-center justify-center text-[#b9966f] [&>svg]:h-[22%] [&>svg]:w-auto"
  >
          {icon}
        </div>
      </div>
    </div>;
}
export {
  GlassDisc
};
