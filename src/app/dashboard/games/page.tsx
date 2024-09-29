import { BiArrowToRight, BiRightArrow } from "react-icons/bi";
import GamesNavbar from "./widgets/GamesNavbar";
import GameListForCategory from "./widgets/GameListForCategory";

export default function Games() {
  return (
    <div>
      <GamesNavbar />
      {[{ name: "Holiday" }, { name: "Life Changer" }, { name: "Pocket" }].map(
        (item, index) => {
          return <GameListForCategory key={index} title={item.name} />;
        }
      )}
    </div>
  );
}
