import Iframe from "react-iframe";
import Sidebar from "../../components/main/Sidebar";

const BasicEmbeded = ({ url, main, label }: any) => {
  return (
    <Sidebar
      activeItem={main.name}
      breadcrumbs={[
        { label: main.label, path: main.path },
        { label: label, url },
      ]}
      renderContent={
        <>
          <div className="w-full h-[88vh]">
            <Iframe url={url} className="w-full h-full rounded-xl bg-white" />
          </div>
        </>
      }
    />
  );
};

export default BasicEmbeded;
