import joi from "joi";

export const updateStatusSchema = {
  body: joi.object().keys({
    status: joi.string().valid("active", "suspended", "terminated").required()
  })
};

export default {
  updateStatusSchema
};
