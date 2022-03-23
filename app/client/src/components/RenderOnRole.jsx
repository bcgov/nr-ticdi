import PropTypes from "prop-types";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../app/appSlice";

export default function RenderOnRole({ roles, children }) {


  return children;
}

RenderOnRole.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.number).isRequired,
};
