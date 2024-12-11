import MainPage from "./MainPage";
import ComicsPage from "./ComicsPage";
import Page404 from "./404";
import SingleComicPage from "./SingleComicPage";

//делается для того, когда много страниц что бы мы не импортирывали каждую страницу отдельно
//(а в таком формате: import { MainPage, ComicsPage } from "../pages";)

export { MainPage, ComicsPage, Page404, SingleComicPage };