import { useTheme } from "../../context/ThemeContext";
import { getScoreColor, getBarColor, getBarWidth } from "../../utils/scoreHelpers";

export default function PriorityBoard({ data }) {
  const { dark } = useTheme();

  return (
    <section
      className="rounded-2xl p-5"
      style={{
        background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.1)",
        boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.08)",
        border: dark ? "1px solid rgba(255,255,255,0.05)" : "2px solid #fff",
      }}
      aria-label="Daftar isu prioritas tertinggi"
    >
      <h2
        className="text-xl font-bold text-center mb-5 font-raleway"
        style={{ color: dark ? "#e2e8f0" : "#000" }}
      >
        Priority Board
      </h2>

      <ol className="flex flex-col gap-4" style={{ listStyle: "none", padding: 0 }}>
        {data.map((item) => (
          <li key={item.rank} className="flex items-center gap-2.5 cursor-pointer group">
            <span
              className="text-xl font-bold font-inter w-8 text-right shrink-0"
              style={{ color: "#9c9393" }}
            >
              #{item.rank}
            </span>

            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-bold font-raleway truncate mb-1.5 group-hover:underline"
                style={{ color: dark ? "#e2e8f0" : "#000" }}
              >
                {item.issue}
              </p>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: dark ? "#1e293b" : "#cfcfcf" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: getBarWidth(item.score), background: getBarColor(item.score) }}
                  role="progressbar"
                  aria-valuenow={item.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>

            <span
              className="text-xl font-bold font-inter w-9 text-right shrink-0"
              style={{ color: getScoreColor(item.score, dark) }}
            >
              {item.score}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
