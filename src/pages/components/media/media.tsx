import styles from "./media.module.css";
import Image from "next/image";

interface MediaProps {
  name: string;
  type: string;
}

export default function Media({ name, type }: MediaProps) {

  const filePath = `/photos/${name}`;
  console.log(type);

  return (
    <div className={styles.media}>
      {(type === "image" || type === "picture")&&
        <Image
          className={styles.image}
          src={filePath}
          alt="image"
          sizes="100vw, 100vw"
          priority
          fill
        />}
      {type === "video" &&
        <video
          className={styles.video}
          src={filePath}
          autoPlay
          muted
          controls
        />}
    </div>
  );
}