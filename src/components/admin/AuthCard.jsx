// Centered card used by the login / forgot / reset pages.
export function AuthCard({ title, children }) {
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C41E3A]">
            Espace Staff
          </span>
          <h1
            className="text-2xl font-bold uppercase text-white mt-1"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Medlout <span className="text-[#C41E3A]">Auto</span>
          </h1>
        </div>
        <div className="bg-white rounded-xl p-8 border-t-4 border-[#C41E3A] shadow-2xl">
          {title && <h2 className="mb-5 text-base font-bold text-[#1A1A1A]">{title}</h2>}
          {children}
        </div>
      </div>
    </div>
  );
}

export const authInput =
  "mt-1.5 w-full border border-[#B4B4B4]/40 rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#C41E3A]";
export const authLabel = "block text-[11px] font-bold uppercase tracking-wide text-[#626060]";
export const authButton =
  "w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#C41E3A] transition-all disabled:opacity-50";
