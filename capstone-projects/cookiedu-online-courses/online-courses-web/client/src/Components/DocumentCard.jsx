const DocumentCard = ({ document, children }) => {
  return (
    <>
      <div className="mb-5">
        <div className={`card h-100 bg-danger-subtle`}>
          <iframe
            src={`https://player.cloudinary.com/embed/?cloud_name=dinyrr5ad&public_id=${document.cloudinary}`}
            width="640"
            height="360"
            style={{
              height: "auto",
              width: "100%",
              aspectRatio: "640 / 360",
            }}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="card-header">
            <div className="d-flex justify-content-between">
              <p className="fs-4 text-primary">{document.title}</p>
              <div>{children}</div>
            </div>
          </div>
          <div className="card-body">{document.description}</div>
          <div className="card-footer text-end">
            {new Date(document.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentCard;
