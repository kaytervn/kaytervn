const makeErrorResponse = ({ res, message, data }) => {
  return res.status(400).json({ result: false, message, data });
};

const makeSuccessResponse = ({ res, message, data }) => {
  return res.status(200).json({ result: true, message, data });
};

export { makeErrorResponse, makeSuccessResponse };
