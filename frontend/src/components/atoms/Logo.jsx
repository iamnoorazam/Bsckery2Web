import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
    <span className="text-2xl">🥐</span>
    <span>BakeryCo</span>
  </Link>
);

export default Logo;
