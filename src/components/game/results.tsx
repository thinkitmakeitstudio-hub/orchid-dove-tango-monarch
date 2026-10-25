import { CLASSES, RELICS } from "@/game/content";
import { useGame } from "@/game/store";
import { ClassMark, RelicCard } from "./cards";

export function Results() {
  const results = useGame((s) => s.results);
  const pickKeepsake = useGame((s) => s.pickKeepsake);
  const returnToCamp = useGame((s) => s.returnToCamp);
  if (!results) return null;
  const anyRelic = results.rows.some((r) => r.relics.length > 0);

  return (
    <div className="screen">
      <div className="scroll-body">
      <header className="mast">
        <p className="kicker">{results.victory ? "The gate is quiet" : "The hall keeps you"}</p>
        <h1>{results.victory ? "Victory" : "Defeated"}</h1>
        <p className="lede">
          {results.victory
            ? "The Hollow King is dust. Levels stay with the guild. Bind one relic as a keepsake, or leave them all."
            : "The delve ends. Experience already earned stays. The relics do not."}
        </p>
      </header>
      <section className="section">
        <div className="roster">
          {results.rows.map((row) => (
            <article key={row.id} className={`hero-plate class-${row.classId}`}>
              <div className="plate-top">
                <div>
                  <p className="role">{CLASSES[row.classId]?.name}</p>
                  <h3 className="name font-display">{row.name}</h3>
                </div>
                <ClassMark classId={row.classId} />
              </div>
              <div className="stats-row">
                <span className="stat">+{row.xp} xp</span>
                <span className="stat">
                  Lv {row.from}
                  {row.to !== row.from ? ` → ${row.to}` : ""}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
      {results.unlocked.length > 0 ? (
        <section className="section">
          <h2>New at the guild</h2>
          <ul>
            {results.unlocked.map((id) => (
              <li key={id} className="hint">
                {CLASSES[id]?.heroName} — {CLASSES[id]?.name}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {results.victory && anyRelic ? (
        <section className="section">
          <h2>Bind a keepsake</h2>
          <p className="hint">One relic, on the hero who carried it. This replaces their previous keepsake.</p>
          {results.rows.map((row) =>
            row.relics.length ? (
              <div key={row.id}>
                <p className="role">{row.name}</p>
                <div className="h-scroll">
                  {row.relics.map((id) => (
                    <RelicCard
                      key={id}
                      relicId={id}
                      selected={results.choice?.heroId === row.id && results.choice.relicId === id}
                      onClick={() => pickKeepsake(row.id, id)}
                    />
                  ))}
                </div>
              </div>
            ) : null,
          )}
          {results.choice ? (
            <p className="lock-line">
              {results.rows.find((r) => r.id === results.choice?.heroId)?.name} will keep{" "}
              {RELICS[results.choice.relicId]?.name}.
            </p>
          ) : (
            <p className="hint">Nothing selected — you can leave empty-handed.</p>
          )}
        </section>
      ) : null}
      </div>
      <footer className="action-bar">
        <button type="button" className="btn btn-gold" onClick={returnToCamp}>
          Return to the hall
        </button>
      </footer>
    </div>
  );
}
