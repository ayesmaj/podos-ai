/**
 * LastVerified — published / last-verified / reviewer line for
 * technical pages and insights (SEO master brief §8, §10).
 */

export default function LastVerified(props: {
  published: string;
  lastVerified: string;
  author: string;
  reviewer?: string;
}) {
  return (
    <p
      style={{
        fontFamily: "var(--font-geist-mono), monospace",
        fontSize: 12,
        letterSpacing: "0.06em",
        color: "var(--graphite)",
        display: "flex",
        flexWrap: "wrap",
        gap: "0.6rem 1.4rem",
      }}
    >
      <span>
        PUBLISHED <time dateTime={props.published}>{props.published}</time>
      </span>
      <span>
        LAST VERIFIED <time dateTime={props.lastVerified}>{props.lastVerified}</time>
      </span>
      <span>BY {props.author.toUpperCase()}</span>
      {props.reviewer && <span>REVIEWED {props.reviewer.toUpperCase()}</span>}
    </p>
  );
}
