import { useState } from "react";
import { db } from "./firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useRecoilState, useSetRecoilState } from "recoil";
import { PortfolioTickers, UserEmail, ActiveTickers } from "./atoms";
import { TickerOption } from "./types";

export const setUserDoc = async (email: string, portfolioTickers: TickerOption[]) => {
  if (email === "") return;
  await setDoc(doc(db, "users", `${email}`), {
    email: email,
    portfolio: JSON.stringify(portfolioTickers ? portfolioTickers : []),
  });
}

const User = () => {
  const setPortfolioTickers = useSetRecoilState(PortfolioTickers);
  const setActiveTickers = useSetRecoilState(ActiveTickers);
  const [ email, setEmail ] = useState("");
  const [ emailRecoil, setEmailRecoil ] = useRecoilState(UserEmail);

  return (
    <form 
    style={{display: "flex", flexDirection: "row"}}
    onSubmit={async (e)=>{
      e.preventDefault();
      if (email !== "") {
        const docRef = doc(db, "users", `${email}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const portfolio = JSON.parse(data.portfolio)
          setPortfolioTickers(portfolio.length > 0 ? portfolio : null);
          setActiveTickers(null);
        }
      }
      setEmailRecoil(email);
    }}>
      <input
        style={{borderRadius: "5px", boxShadow: "none", border: "none", padding: 2, marginRight: 5}}
        type="email"
        name="email"
        disabled={emailRecoil !== ""}
        placeholder="full-name@email.com"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        value={email}
      />
      {emailRecoil==="" ? <button 
        disabled={email === ""}
        style={{borderRadius: "5px", boxShadow: "none", border: "none", cursor: "pointer"}}
        type="submit">Submit</button> :
      <button 
      style={{borderRadius: "5px", boxShadow: "none", border: "none", cursor: "pointer"}}
      onClick={()=>{
        setEmailRecoil("");
        setEmail("");
        setPortfolioTickers(null);
        setActiveTickers(null);
      }}>Logout</button>}
    </form>
  );
}
export default User;