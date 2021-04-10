import React, { useState, memo } from "react";
import { Star, StarFilled, Trash, Check, Cross } from "../assets";
import styles from "../styles/Friend.module.css";

export default memo(function Friend({
  data: { name, id, isFavorite },
  removeFriend,
  toggleFavorite,
}) {
  const [removalTriggered, triggerRemoval] = useState(false);

  return (
    <div className={styles.main}>
      {removalTriggered ? (
        <>
          <p className={styles.confirmation}>Are you sure?</p>
          <div className={styles.actions}>
            <div>
              <Check onClick={() => removeFriend(id)} />
            </div>
            <div>
              <Cross onClick={() => triggerRemoval(false)} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <p className={styles.friendName}>{name}</p>
            <p className={styles.subText}>is your friend</p>
          </div>
          <div className={styles.actions}>
            <div
              className={styles.mainAction}
              onClick={() => toggleFavorite(id)}
            >
              {isFavorite ? <StarFilled /> : <Star />}
            </div>
            <div
              className={styles.mainAction}
              onClick={() => triggerRemoval(true)}
            >
              <Trash />
            </div>
          </div>
        </>
      )}
    </div>
  );
});
