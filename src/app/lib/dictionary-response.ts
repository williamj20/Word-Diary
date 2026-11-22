import z from 'zod';

const NonblankText = z.string().trim().min(1);

// Ignore malformed optional audio without losing otherwise usable definitions
// or valid recordings elsewhere in the pronunciation array.
const DictionaryPronunciationSchema = z
  .object({
    mw: z.string().optional(),
    sound: z
      .object({ audio: z.string().optional().catch(undefined) })
      .optional()
      .catch(undefined),
  })
  .nullable()
  .catch(null);

export const DictionaryPronunciationsSchema = z
  .array(DictionaryPronunciationSchema)
  .optional()
  .catch(undefined);

export type DictionaryPronunciations = z.infer<
  typeof DictionaryPronunciationsSchema
>;

const pronunciationFields = { prs: DictionaryPronunciationsSchema };

const VariantSchema = z.object({
  va: z.string(),
  ...pronunciationFields,
});

const InflectionSchema = z.object({
  if: z.string().optional(),
  ...pronunciationFields,
});

const formFields = {
  ins: z.array(InflectionSchema).optional(),
  vrs: z.array(VariantSchema).optional(),
};

const sourceFields = {
  fl: z.string().optional(),
  shortdef: z.array(z.string()).optional(),
  // Only the limited sense extractor reads these sections. Keep their structure
  // without requiring unrelated illustrations/etymologies to validate.
  def: z
    .array(
      z.object({
        vd: z.string().optional(),
        sseq: z.array(z.unknown()),
      })
    )
    .optional(),
};

export const DictionaryServiceObjectSchema = z.object({
  meta: z.object({ id: NonblankText, stems: z.array(z.string()).optional() }),
  hwi: z.object({ hw: NonblankText, ...pronunciationFields }),
  ...sourceFields,
  ...formFields,
  ahws: z
    .array(z.object({ hw: z.string(), ...pronunciationFields }))
    .optional(),
  uros: z
    .array(
      z.object({
        ure: z.string(),
        fl: z.string().optional(),
        ...pronunciationFields,
        ...formFields,
      })
    )
    .optional(),
  dros: z
    .array(
      z.object({
        drp: z.string(),
        ...sourceFields,
        ...pronunciationFields,
        ...formFields,
      })
    )
    .optional(),
  cxs: z
    .array(
      z.object({
        cxl: z.string().optional(),
        cxtis: z.array(
          z.object({
            cxt: z.string(),
            cxr: z.string().optional(),
            cxn: z.string().optional(),
            cxl: z.string().optional(),
          })
        ),
      })
    )
    .optional(),
});

export type DictionaryServiceObject = z.infer<
  typeof DictionaryServiceObjectSchema
>;

export const DictionaryServiceResponseSchema = z.union([
  z.array(z.string()),
  z.array(DictionaryServiceObjectSchema),
]);

export type DictionaryServiceResponse = z.infer<
  typeof DictionaryServiceResponseSchema
>;
