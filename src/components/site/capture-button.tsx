import Link from "next/link";
import styles from "./capture-button.module.css";

export default function CaptureButton() {
  return (
    <Link
      href="/#contact"
      className={styles.wrapper}
      aria-label="Start a project — contact MUFASA"
    >
      <span className={styles.button}>
        <span className={styles.letter}>S</span>
        <span className={styles.letter}>t</span>
        <span className={styles.letter}>a</span>
        <span className={styles.letter}>r</span>
        <span className={styles.letter}>t</span>

        <span className={styles.space} />

        <span className={styles.letter}>a</span>

        <span className={styles.space} />

        <span className={styles.letter}>p</span>
        <span className={styles.letter}>r</span>
        <span className={styles.letter}>o</span>
        <span className={styles.letter}>j</span>
        <span className={styles.letter}>e</span>
        <span className={styles.letter}>c</span>
        <span className={styles.letter}>t</span>

        <span className={styles.shutterWrapper} aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className={styles.shutter}
              style={{ zIndex: i + 1, transform: `rotate(${i * 60}deg)` }}
            />
          ))}
        </span>
      </span>

      <span className={styles.flash} aria-hidden="true" />
    </Link>
  );
}