import { CARDS, CLASSES, RELICS, SUPPLIES } from "@/game/content";
import { cardPowerLabel } from "@/game/engine";
import type { Floater, Rarity } from "@/game/types";
import { GameIcon } from "./icons";

export function Floaters({ items }: { items: Floater[] }) {
  if (!items.length) return null;
  return (
    <span className="floaters" aria-hidden="true">
      {items.map((f) => (
        <em key={f.id} className={`floater floater-${f.kind}`}>
          {f.text}
        </em>
      ))}
    </span>
  );
}

export function PowerCard({
  cardId,
  selected,
  disabled,
  onClick,
  testId,
  atk,
  atkBuff,
  dry,
  free,
  spent,
  held,
  badge,
  badgeHot,
  accent,
}: {
  cardId: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  testId?: string;
  atk: number;
  atkBuff: number;
  dry?: boolean;
  free?: boolean;
  spent?: boolean;
  held?: boolean;
  badge?: string;
  badgeHot?: boolean;
  accent?: string;
}) {
  const card = CARDS[cardId] ?? SUPPLIES[cardId];
  if (!card) return null;
  const power = cardPowerLabel({ atk, atkBuff }, cardId);
  const kind = "kind" in card ? card.kind : "supply";
  const manaCost = "mana" in card ? card.mana : undefined;
  const body = (
    <>
      <span className="card-kicker">
        <span>
          {kind}
          {free ? <strong className="card-mana is-free"> · free</strong> : null}
          {!free && manaCost ? <strong className="card-mana"> · {manaCost} mana</strong> : null}
          {held ? <strong className="card-mana is-free"> · ready</strong> : null}
          {spent ? <strong className="card-mana"> · spent</strong> : null}
          {badge ? <strong className={`card-mana${badgeHot ? " is-free" : ""}`}> · {badge}</strong> : null}
        </span>
        {power ? <strong className="card-power">{power}</strong> : null}
      </span>
      <span className="card-name font-display">{card.name}</span>
      <span className="card-text">{card.text}</span>
    </>
  );
  const className = `playing-card${accent ? ` class-${accent}` : ""}${selected ? " is-selected" : ""}${disabled ? " is-disabled" : ""}${dry ? " is-dry" : ""}`;
  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick} disabled={disabled} data-testid={testId}>
        {body}
      </button>
    );
  }
  return <div className={className}>{body}</div>;
}

export function RelicCard({
  relicId,
  selected,
  onClick,
  testId,
}: {
  relicId: string;
  selected?: boolean;
  onClick?: () => void;
  testId?: string;
}) {
  const relic = RELICS[relicId];
  if (!relic) return null;
  const className = `playing-card relic relic-${relic.rarity}${selected ? " is-selected" : ""}`;
  const body = (
    <>
      <span className="card-kicker">
        <span>{rarityLabel(relic.rarity)}</span>
        <GameIcon name={relic.rarity === "mythic" ? "crown" : relic.rarity === "rare" ? "gem" : "spark"} className="icon-sm" />
      </span>
      <span className="card-name font-display">{relic.name}</span>
      <span className="card-text">{relic.text}</span>
    </>
  );
  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick} data-testid={testId}>
        {body}
      </button>
    );
  }
  return <div className={className}>{body}</div>;
}

function rarityLabel(r: Rarity): string {
  if (r === "mythic") return "Mythic";
  if (r === "rare") return "Rare";
  return "Common";
}

export function ClassMark({ classId, className }: { classId: string; className?: string }) {
  const cls = CLASSES[classId];
  if (!cls) return null;
  return (
    <span className={className ?? "mark"}>
      <GameIcon name={cls.icon} />
    </span>
  );
}
