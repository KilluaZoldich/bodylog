// Couturier mark — small serif monogram at the bottom of each page.
// Goes between the last content and the bottom nav.
export default function SignatureMark() {
  return (
    <div className="mt-10 mb-4 flex flex-col items-center gap-1.5 opacity-50">
      <span className="font-editorial text-[22px] leading-none text-accent italic select-none">
        M<span className="text-accent/60">.</span>
      </span>
      <div className="h-px w-6 hairline" />
      <span className="label-editorial !text-[8px] !tracking-[0.3em]">BodyLog</span>
    </div>
  )
}
