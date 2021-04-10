import React, { useState, useRef, useEffect, useCallback } from "react";
import { logo, Smiley, ArrowLeft, ArrowRight, Dropdown } from "../assets";
import Friend from "./Friend";
import { v4 as uuid } from "uuid";
import styles from "../styles/FriendsList.module.css";

export default function FriendsList() {
  const [friendsList, setFriendsList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [friendValue, setFriendValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [indexValues, setIndexValues] = useState({ start: 0, end: 4 });
  const [sortingEnabled, setSorting] = useState(false);
  const friendInput = useRef();

  useEffect(() => {
    let dummyData = [
      "Bruce Banner",
      "Peter Parker",
      "Stephen Strange",
      "Steve Rogers",
      "Sharon Carter",
      "Wanda Maximoff",
      "Tony Stark",
      "Pepper Potts",
      "Natasha Romanoff",
    ];
    let friendsList = dummyData.map((data) => ({
      id: uuid(),
      name: data,
      isFavorite: false,
    }));
    setFriendsList(friendsList);
  }, []);

  useEffect(() => {
    let filteredFriends = friendsList.filter(
      (friend) =>
        friend.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
    );
    setFilteredList(filteredFriends);
  }, [searchValue]);

  function handleKeyPress(e) {
    if (e.keyCode === 13) {
      if (friendValue.length) {
        addNewFriend(friendValue);
      } else {
        friendInput.current.style.border = "2px solid #FF3E1D";
        setTimeout(() => {
          friendInput.current.style.border = "2px solid transparent";
        }, 2000);
      }
    }
  }

  function addNewFriend(name) {
    let currentFriends = [...friendsList];
    currentFriends.unshift({ id: uuid(), name, isFavorite: false });
    setFriendsList(currentFriends);
    setFriendValue("");
  }

  function removeFriend(id) {
    if (searchValue) {
      let filteredFriends = filteredList.filter((friend) => friend.id !== id);
      setFilteredList(filteredFriends);
    }
    let filteredFriends = friendsList.filter((friend) => friend.id !== id);
    setFriendsList(filteredFriends);
  }

  const memoizedRF = useCallback((id) => removeFriend(id), [
    friendsList,
    filteredList,
  ]);

  function setPagination(direction) {
    if (direction === "left") {
      if (indexValues.start > 0) {
        setIndexValues({
          start: indexValues.start - 4,
          end: indexValues.end - 4,
        });
      }
    } else {
      if (indexValues.end < friendsList.length) {
        setIndexValues({
          start: indexValues.start + 4,
          end: indexValues.end + 4,
        });
      }
    }
  }

  function toggleFavorite(id) {
    if (searchValue) {
      let filteredFriends = filteredList.map((friend) =>
        friend.id === id
          ? { ...friend, isFavorite: !friend.isFavorite }
          : friend
      );
      setFilteredList(filteredFriends);
    }

    let filteredFriends = friendsList.map((friend) =>
      friend.id === id ? { ...friend, isFavorite: !friend.isFavorite } : friend
    );
    setFriendsList(filteredFriends);
  }

  const memoizedTF = useCallback((id) => toggleFavorite(id), [
    friendsList,
    filteredList,
  ]);

  function sortByFavorites() {
    if (searchValue) {
      let sortedList = sortingEnabled
        ? filteredList.sort((a, b) => a.isFavorite - b.isFavorite)
        : filteredList.sort((a, b) => b.isFavorite - a.isFavorite);
      setFilteredList(sortedList);
    }

    let sortedList = sortingEnabled
      ? friendsList.sort((a, b) => a.isFavorite - b.isFavorite)
      : friendsList.sort((a, b) => b.isFavorite - a.isFavorite);
    setSorting(!sortingEnabled);
    setFriendsList(sortedList);
  }

  let friendsData = searchValue ? filteredList : friendsList;

  return (
    <div onKeyDown={handleKeyPress} className={styles.main}>
      <div className={styles.header}>
        <img src={logo} alt="Haptik Logo" />
        <p>friends</p>
        <input
          onChange={(e) => setSearchValue(e.target.value)}
          className={styles.searchBar}
          value={searchValue}
          placeholder="Search ..."
        />
      </div>
      <input
        ref={friendInput}
        onChange={(e) => setFriendValue(e.target.value)}
        className={styles.addNew}
        placeholder="Found a new friend? Add him/her here!"
        value={friendValue}
      />
      <div onClick={sortByFavorites} className={styles.sortBy}>
        Sort by Favorites{" "}
        <Dropdown
          style={sortingEnabled ? { transform: "rotate(180deg)" } : undefined}
        />
      </div>
      {friendsData.length ? (
        friendsData
          .slice(indexValues.start, indexValues.end)
          .map((friend) => (
            <Friend
              key={friend.id}
              data={friend}
              removeFriend={memoizedRF}
              toggleFavorite={memoizedTF}
            />
          ))
      ) : (
        <p className={styles.noFriends}>
          No friends found. Don't be shy. Go ahead and make some <Smiley />
        </p>
      )}
      <div style={{ flexGrow: 1 }} />
      <div
        className={
          friendsData.length > 4
            ? `${styles.pagination} ${styles.active}`
            : styles.pagination
        }
      >
        <ArrowLeft
          className={indexValues.start <= 0 ? styles.disabled : undefined}
          onClick={() => setPagination("left")}
        />
        <ArrowRight
          className={
            indexValues.end >= friendsData.length ? styles.disabled : undefined
          }
          onClick={() => setPagination("right")}
        />
      </div>
    </div>
  );
}
