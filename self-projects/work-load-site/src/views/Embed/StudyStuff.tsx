import { STUDY_LIST } from "../../components/config/EmbedConfig";
import { STUDY_STUFF } from "../../types/pageConfig";
import EmbedList from "./EmbedList";

const StudyStuff = () => {
  return <EmbedList pageConfig={STUDY_STUFF} embedList={STUDY_LIST} />;
};

export default StudyStuff;
