import { Link } from 'react-router-dom'
import CourseLessonList from './CourseLessonList'

/**
 * 梭织手链课程(course3)专属落地页版式。
 *
 * 严格对照设计交接包实现:
 *   content/courses/course3/梭织手链网站_开发交接包/README_开发交接.md
 *
 * 版面顺序:Hero → 课程介绍 → 你将会学到 → 分隔线 → 导师介绍 → 课程目录。
 * 设计稿没有画课程目录,按约定放在导师介绍之后收尾。
 *
 * 字号/行高/颜色取自交接包 §4,设计稿是 794px 参考宽度的竖版,
 * 这里按响应式实现,不按绝对坐标还原。
 */
function WovenBraceletLanding({ course, courseId, zh, hasAccess, kicked, checking }) {
  const { landing, lessons } = course
  const title = zh ? course.title : course.titleEn
  const heroMeta = [
    (zh ? course.difficulty : course.difficultyEn).toUpperCase(),
    zh ? course.duration : course.durationEn,
    zh ? `${lessons.length} 节课` : `${lessons.length} lessons`,
  ].join(' · ')

  return (
    <div className="bg-white font-cn text-ink">
      {/* ── Hero：全宽背景图 + 深色遮罩 ───────────────────────────── */}
      <section className="relative h-[240px] md:h-[320px] overflow-hidden">
        <img
          src={landing.heroImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 text-white">
          <p className="text-[15px] md:text-[17px] tracking-[0.12em] opacity-90">{heroMeta}</p>
          <h1 className="mt-2 font-bold text-[clamp(28px,6vw,44px)] leading-tight tracking-[0.04em]">
            {title}
          </h1>
        </div>
      </section>

      {/* ── 课程介绍：左图右文，近似 50/50；窄屏上下堆叠 ───────────── */}
      <section className="grid md:grid-cols-2 items-stretch">
        <div className="aspect-[4/3] md:aspect-auto md:min-h-[360px]">
          <img
            src={landing.introImage}
            alt={zh ? landing.heading : landing.headingEn}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-10 md:px-10 lg:px-14">
          <h2 className="font-bold text-[clamp(22px,3.4vw,30px)] leading-[1.3]">
            {zh ? landing.heading : landing.headingEn}
          </h2>
          {zh && (
            <p className="mt-1 font-optima italic text-[clamp(18px,2.6vw,24px)] leading-[1.2]">
              {landing.headingLatin}
            </p>
          )}
          {/* 设计稿此处有「激活课程 / 登 陆」两个按钮,按需求去掉:
              Header 已有登录入口,开通引导统一收在页尾的课程目录里。 */}
          <p className="mt-6 max-w-[34em] text-[15px] leading-[28px]">
            {zh ? landing.intro : landing.introEn}
          </p>
        </div>
      </section>

      {/* ── 你将会学到：桌面 3 列 × 2 行，手机 1 列 ─────────────────── */}
      <section className="mx-auto max-w-5xl px-6 md:px-10 pt-14 md:pt-20">
        <h2 className="font-bold text-[clamp(20px,2.6vw,23px)] leading-7">
          {zh ? '你将会学到' : 'What you will learn'}
        </h2>
        {zh && (
          <p className="mt-0.5 font-optima italic text-[18px] leading-[22px]">
            What you will learn
          </p>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-9">
          {landing.learnPoints.map((point) => {
            const pTitle = zh ? point.title : point.titleEn
            const pDesc = zh ? point.desc : point.descEn
            return (
              <article key={point.title}>
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={point.image}
                    alt={pTitle}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-3 font-bold text-[16px] leading-5 text-ink-strong">{pTitle}</h3>
                {pDesc && (
                  <p className="mt-1.5 text-[12px] leading-[14.4px] text-ink-strong">{pDesc}</p>
                )}
              </article>
            )
          })}
        </div>
      </section>

      {/* ── 分隔线：设计稿 0.5pt #231916 ───────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 md:px-10 pt-14 md:pt-20">
        <hr className="border-0 border-t border-ink/60" />
      </div>

      {/* ── 导师介绍：左 2:3 肖像，右文案 ──────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 md:px-10 pt-14 md:pt-20">
        <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 md:gap-12">
          <div className="aspect-[2/3] overflow-hidden bg-gray-100">
            <img
              src={landing.instructor.photo}
              alt={zh ? landing.instructor.name : landing.instructor.nameEn}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-start">
            <h2 className="font-bold text-[clamp(20px,2.6vw,23px)] leading-7">
              {zh ? '导师介绍' : 'Meet the Instructor'}
              <span className="font-normal"> / </span>
              <span className="text-[21px]">
                {zh ? landing.instructor.name : landing.instructor.nameEn}
              </span>
            </h2>
            {zh && (
              <p className="mt-0.5 font-optima italic text-[18px] leading-[22px]">
                Meet the Instructor
              </p>
            )}

            <p className="mt-5 text-[15px] leading-6">
              {zh ? landing.instructor.role : landing.instructor.roleEn}
            </p>
            {(zh ? landing.instructor.bio : landing.instructor.bioEn).map((para, i) => (
              <p key={i} className="mt-3 text-[15px] leading-6">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── 课程目录（设计稿外，保留原有权限/进度功能）─────────────── */}
      <section className="mx-auto max-w-5xl px-6 md:px-10 pt-14 md:pt-16 pb-14 md:pb-20">
        {kicked && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <p className="text-amber-900">
              {zh
                ? '登录状态已失效。同一账号最多可在 2 台设备上使用，请重新登录后继续学习。'
                : 'Your session has expired. An account can stay signed in on up to 2 devices. Please sign in again to continue.'}
            </p>
            <Link to="/login?redirect=/my-courses" className="btn-primary inline-block mt-4">
              {zh ? '重新登录' : 'Sign in again'}
            </Link>
          </div>
        )}

        <CourseLessonList
          courseId={courseId}
          lessons={lessons}
          hasAccess={hasAccess}
          kicked={kicked}
          checking={checking}
          zh={zh}
          variant="plain"
        />
      </section>
    </div>
  )
}

export default WovenBraceletLanding
