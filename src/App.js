import { useState } from "react"

const initialFriends = [
    {
        id: 118836,
        name: "Clark",
        image: "https://i.pravatar.cc/48?u=118836",
        balance: -7,
    },
    {
        id: 933372,
        name: "Sarah",
        image: "https://i.pravatar.cc/48?u=933372",
        balance: 20,
    },
    {
        id: 499476,
        name: "Anthony",
        image: "https://i.pravatar.cc/48?u=499476",
        balance: 0,
    },
]

const Button = ({ children, onClick }) => {
    return (
        <button className="button" onClick={onClick}>
            {children}
        </button>
    )
}

const App = () => {
    const [showAddFriend, setShowAddFriend] = useState(false)
    const [friends, setFriends] = useState(initialFriends)
    const [selectFriend, setSelectFriend] = useState(null)

    const handelAddFriend = (friend) => {
        setFriends((friends) => [...friends, friend])
        setShowAddFriend(false)
    }
    const handelSelections = (friend) => {
        // setSelectFriend(friend)
        setSelectFriend((curr) => (curr?.id === friend.id ? null : friend))
        setShowAddFriend(false)
    }
    const handelSplitBill = (value) => {
        setFriends((friends) =>
            friends.map((friend) =>
                friend.id === selectFriend.id
                    ? { ...friend, balance: friend.balance + value }
                    : friend
            )
        )
        setSelectFriend(null)
    }

    return (
        <div className="app">
            <div className="sidebar">
                <FriendList
                    friends={friends}
                    selectFriend={selectFriend}
                    onSelection={handelSelections}
                />
                {showAddFriend && (
                    <FormAddFriend onAddFriend={handelAddFriend} />
                )}
                <Button onClick={() => setShowAddFriend(!showAddFriend)}>
                    {showAddFriend ? "Close" : "Add Friend"}
                </Button>
            </div>
            {selectFriend && (
                <FormSplitBill
                    selectFriend={selectFriend}
                    onSplitBill={handelSplitBill}
                    key={selectFriend.id}
                />
            )}
        </div>
    )
}

export default App

const FriendList = ({ friends, onSelection, selectFriend }) => {
    return (
        <ul className="">
            {friends.map((friend) => (
                <Friend
                    friend={friend}
                    key={friend.id}
                    selectFriend={selectFriend}
                    onSelection={onSelection}
                />
            ))}
        </ul>
    )
}

const Friend = ({ friend, onSelection, selectFriend }) => {
    const isSelected = selectFriend?.id === friend.id

    return (
        <li className={isSelected ? "selected" : ""}>
            <img src={friend.image} alt={friend.name} />
            <h3 className="title">{friend.name}</h3>

            {friend.balance < 0 && (
                <p className="red">
                    You own {friend.name} {Math.abs(friend.balance)}€
                </p>
            )}
            {friend.balance > 0 && (
                <p className="green">
                    {friend.name} owes you {Math.abs(friend.balance)}€
                </p>
            )}
            {friend.balance === 0 && <p>You and {friend.name} are even</p>}

            <Button onClick={() => onSelection(friend)}>
                {isSelected ? "close" : "Select"}
            </Button>
        </li>
    )
}

const FormAddFriend = ({ onAddFriend }) => {
    const [name, setName] = useState("")
    const [image, setImage] = useState("https://i.pravatar.cc/48")

    const handelSubmit = (e) => {
        e.preventDefault()

        if (!name || !image) return

        const id = crypto.randomUUID()

        const newFriend = {
            id,
            name,
            image: `${image}?=${id}`,
            balance: 0,
        }

        onAddFriend(newFriend)

        console.log(newFriend)

        setName("")
        setImage("https://i.pravatar.cc/48")
    }

    return (
        <form className="form-add-friend" onSubmit={handelSubmit}>
            <label>👩🏻‍🤝‍🧑🏻 Friend name</label>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
            />

            <label>🖼 Image</label>
            <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                type="text"
            />

            <Button>Add</Button>
        </form>
    )
}

const FormSplitBill = ({ selectFriend, onSplitBill }) => {
    const [bill, setBill] = useState("")
    const [paidByUser, setPaidByUser] = useState("")
    const paidByFriend = bill ? bill - paidByUser : ""
    const [whoIsPaying, setWhoIsPaying] = useState("user")

    const handelSubmit = (e) => {
        e.preventDefault()

        if (!bill || !paidByUser) return

        onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser)
    }

    return (
        <form className="form-split-bill" onSubmit={handelSubmit}>
            <h2>Split Bill with {selectFriend.name}</h2>
            <label>💰 Bill Value</label>
            <input
                type="text"
                value={bill}
                onChange={(e) => setBill(Number(e.target.value))}
            />

            <label>🧍‍♂️ {selectFriend.name} Your Expense</label>
            <input
                type="text"
                value={paidByUser}
                onChange={(e) =>
                    setPaidByUser(
                        Number(e.target.value) > bill
                            ? paidByUser
                            : Number(e.target.value)
                    )
                }
            />

            <label>👩🏻‍🤝‍👩🏻 Your Expense</label>
            <input type="text" disabled value={paidByFriend} />

            <label>🤑 Who is paying the bill </label>
            <select
                value={whoIsPaying}
                onChange={(e) => setWhoIsPaying(e.target.value)}
            >
                <option value="user">User</option>
                <option value="friend">{selectFriend.name}</option>
            </select>

            <Button>Add</Button>
        </form>
    )
}
