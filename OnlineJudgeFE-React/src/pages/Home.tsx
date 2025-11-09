import { HeaderPerfect as Header } from "@/components/HeaderPerfect"
import { HeroSectionPerfect as HeroSection } from "@/components/HeroSectionPerfect"
import { LearningPath } from "@/components/LearningPath"
import { ChallengeSection } from "@/components/ChallengeSection"
import { GrowthSection } from "@/components/GrowthSection"
import { TeacherSection } from "@/components/TeacherSection"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen" style={{ 
      background: 'rgb(238, 238, 238)', // 8080: body背景 #eeeeee 浅灰色
    }}>
      <Header />
      {/* 8080结构: content-app包裹所有内容（main + footer） */}
      <div style={{
        marginTop: '80px',
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        padding: '0 2%', // 8080: content-app padding (双层padding的外层)
        width: '100%', // 🔴 8080: 完全自适应宽度，无max-width限制
        // 🔴 background设为无色，让左右2%padding露出灰色背景
      }}>
        <main style={{
          paddingTop: '0', // 8080: home-main-content-new padding-top: 0
        }}>
          <HeroSection />
          <LearningPath />
          <ChallengeSection />
          <GrowthSection />
          <TeacherSection />
        </main>
        {/* Footer也在content-app内，受padding: 0 2%影响 */}
        <Footer />
      </div>
    </div>
  )
}

