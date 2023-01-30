import { useAuth, User } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Avatar from "./avatar";
import Loader from "./loader";
import Modal from "./modal";

let searchTimeout: NodeJS.Timeout;

const AddMemberModal = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { id, board_title } = router.query;
  const [isOpen, setIsOpen] = useState(false);
  const [usersResults, setUsersResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(searchTimeout);
    setIsSearching(true);
    if (e.target.value === "") {
      setUsersResults([]);
      setIsSearching(false);
      return;
    }

    searchTimeout = setTimeout(async () => {
      const q = query(
        collection(db, "users"),
        where("email", ">=", e.target.value),
        where("email", "<=", e.target.value + "\uf8ff"),
      );
      const querySnapshot = await getDocs(q);
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        const _u = {
          id: doc.id,
          ...doc.data(),
        } as User;
        users.push(_u);
      });
      setUsersResults(users);
      setIsSearching(false);
    }, 500);
  };

  const handleInviteMember = async (memberId: string) => {
    try {
      await addDoc(collection(db, "notifications"), {
        type: "invite",
        from: user?.id,
        to: memberId,
        createdAt: new Date(),
        read: false,
        boardId: id,
        message: `${user?.displayName} invited you to join board ${board_title}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button className="btn" onClick={onOpen}>
        Share
      </button>

      <Modal open={isOpen} onClose={onClose}>
        <div className="bg-white rounded-sm min-h-1/3 max-w-lg w-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Add Member</h1>
            <button className="" onClick={onClose}>
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <input
              type="text"
              className="input mb-4"
              placeholder="Enter email address"
              onChange={handleSearch}
            />
            {isSearching ? (
              <Loader />
            ) : (
              usersResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2 border-b border-gray-200"
                >
                  <div className="flex items-center">
                    <Avatar
                      photoURL={user.photoURL}
                      displayName={user.displayName}
                    />
                    <div className="ml-2">
                      <h4 className="text-sm font-semibold text-gray-800">
                        {user.displayName}
                      </h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    className="btn"
                    onClick={() => handleInviteMember(user.id)}
                  >
                    Invite
                  </button>
                </div>
              ))
            )}
            {!isSearching && usersResults.length === 0 && (
              <p className="text-center text-gray-500">No results found</p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddMemberModal;
