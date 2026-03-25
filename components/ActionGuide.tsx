import type { ActionGuide, GuideItem, DustGuideItem } from "@/lib/types";
import { GUIDE_ICON_MAP } from "@/lib/weather-icons";

interface GuideRowProps {
  item: GuideItem | DustGuideItem;
  showDivider?: boolean;
}

function GuideRow({ item, showDivider = true }: GuideRowProps) {
  const { Icon, className } = GUIDE_ICON_MAP[item.icon];

  return (
    <div>
      <div className="flex items-center gap-3 py-3">
        {/* 아이콘 원형 배지 */}
        <div
          aria-hidden="true"
          className="w-10 h-10 rounded-[var(--radius-icon)] neu-pressed flex items-center justify-center shrink-0"
        >
          <Icon size={20} className={className} />
        </div>

        {/* 가이드 메시지 */}
        <p className="text-sm text-[var(--color-text-main)] leading-snug flex-1">
          {item.message}
        </p>
      </div>

      {showDivider && (
        <div
          aria-hidden="true"
          className="mx-1"
          style={{ height: 0, boxShadow: "0 1px 0 var(--overlay-divider)" }}
        />
      )}
    </div>
  );
}

interface ActionGuideProps {
  guide: ActionGuide;
  className?: string;
}

/**
 * ActionGuide — 서버 컴포넌트
 * 옷차림 / 우산 / 미세먼지 가이드 3종을 neu-raised 카드 안에 표시.
 * PRD FR-03-A/B/C 기준값 기반.
 */
export default function ActionGuide({ guide, className = "mx-4" }: ActionGuideProps) {
  return (
    <section
      aria-label="행동 가이드"
      className={`neu-raised ${className} p-4`}
    >

      <GuideRow item={guide.clothing} />
      <GuideRow item={guide.umbrella} />
      <GuideRow item={guide.dust} showDivider={false} />
    </section>
  );
}
