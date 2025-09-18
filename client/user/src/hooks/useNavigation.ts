import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setCurrentPath } from "../features/navigation/navigation.slice";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { RootState } from "../app/store";

export const useNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentPath = useAppSelector(
    (state: RootState) => state.navigation.currentPath
  );

  // Sync currentPath with URL on component mount and location change
  useEffect(() => {
    const replacePath = location.pathname.replace(/^\/(.*)/, "$1");
    dispatch(setCurrentPath(replacePath));
  }, [location.pathname, dispatch]);

  const navigateTo = (path: string) => {
    navigate(path);
    const replacePath = path.replace(/^\/(.*)/, "$1");
    dispatch(setCurrentPath(replacePath));
  };

  return {
    currentPath,
    navigateTo,
    location,
  };
};
