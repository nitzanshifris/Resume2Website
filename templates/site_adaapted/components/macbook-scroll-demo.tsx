import { MacbookScroll } from "@/components/ui/macbook-scroll"

export default function MacbookScrollDemo() {
  return (
    <div className="w-full overflow-hidden bg-[#0B0B0F]">
      <MacbookScroll src={`https://vercel.com/marketing`} showGradient={false} />
    </div>
  )
}
