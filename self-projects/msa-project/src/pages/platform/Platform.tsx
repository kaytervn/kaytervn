import { BasicAppBar } from "../../components/BasicAppBar";
import { PAGE_CONFIG } from "../../config/PageConfig";

export const Platform = () => {
  return (
    <BasicAppBar
      title={PAGE_CONFIG.PLATFORM.label}
      search={{
        value: "query",
        onChange: () => {},
        onSearch: () => {},
        onClear: () => {},
      }}
      create={{
        onClick: () => {},
      }}
    >
      <></>
    </BasicAppBar>
  );
};
