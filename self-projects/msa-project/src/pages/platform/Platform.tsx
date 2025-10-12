import { BasicAppBar } from "../../components/BasicAppBar";
import { PLATFORM_CONFIG } from "../../config/PageConfigDetails";

export const Platform = () => {
  return (
    <BasicAppBar
      title={PLATFORM_CONFIG.PLATFORM.label}
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
