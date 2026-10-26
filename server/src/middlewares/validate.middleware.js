export const validate = (schema, property = "body") => {
  return async (req, res, next) => {
    try {
      const result = await schema.safeParseAsync(req[property]);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      res.locals.validated ??= {};
      res.locals.validated[property] = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};
