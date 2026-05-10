/**
 * Inspiration board — manual list of saved images for House*Staples.
 *
 * V1 is a flat array of image filenames. Add new ones by dropping the
 * file in /public/case-studies/inspiration/ and re-running
 * scripts/build-inspiration.py (a deterministic shuffle keeps related
 * images from clustering — seed 42).
 *
 * Computer vision rename pass is pending — alt text and meaningful
 * filenames will land later. Hash filenames are placeholders.
 *
 * When this list grows past ~150 items, migrate to Supabase + admin
 * upload.
 */

const IMG = "/case-studies/inspiration";

export type InspirationImage = {
  type: "image";
  src: string;
  alt: string;
};

export const inspiration: InspirationImage[] = [
  { type: "image", src: `${IMG}/e263f046e0e28ea51e8421ff42f8654c.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/a88e9c95-162d-413c-abdb-63665dc15eac.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/b74681408771f94333447f54d0e04acc.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/2458bef2c89314308d4823272bce6fcb.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/81553e32-f44e-4d6d-9a29-7203186fe688.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/6272001fb1ee76b64d1f38782e689f91.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/0b20a5aa-031e-4caf-957a-efc13614ee6b.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/be25bad7db55459be3279886638283fc.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/32a2e745df6a5302330fc95b46c2ad4f.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/b0e30db0365456c50cb9f2e4a3a468e8.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/b8a9970d-0fd8-4b3c-8c6b-e1268a1b9b9a.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/2694db233fa7417e8035c3d211254ae8.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/Shaker CotesUtility - Desktop Gallery 04.jpg.webp`, alt: "Saved image" },
  { type: "image", src: `${IMG}/ca843d73-9475-49af-a93c-9b5395b12ea3.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/Screen+Shot+2019-10-17+at+3.25.25+PM.webp`, alt: "Saved image" },
  { type: "image", src: `${IMG}/f8167dca620dcf72841030b080df96e1.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/IMG_1516.webp`, alt: "Saved image" },
  { type: "image", src: `${IMG}/9daa2ee7af42a383420b2a1b7e17e1f4.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/bc07f878f2842ce2671e57e8e419b13e.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/751a31ac-4fff-4254-930f-0dee8546b4e6.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/Wes-Anderson-photographed-011.avif`, alt: "Saved image" },
  { type: "image", src: `${IMG}/c7d4a0a003e5a46c1b8defc3b7f95ca1.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/Bert and May Kitchen5566.jpg.webp`, alt: "Saved image" },
  { type: "image", src: `${IMG}/802a66f9fd023d6d0d29786a43f972e1.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/wes-anderson1.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/be13cad33bf17d388866ebee38030925.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/https___prod-bof-media.s3.eu-west-1.amazonaws.com_import_profiles_asset_262_63082e245a63f2933acee9e1d1f2746216dbfed8.avif`, alt: "Saved image" },
  { type: "image", src: `${IMG}/1f01298c864fcfd2159043840c4abafb.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/93897fc223751d3830b8641c2ebabd09.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/ce6cbc0c-e85c-4657-9dd9-4fdcc85955a5.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/d6fd2ed96844f7cf47a40098c5f38db0.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/Caps-24989_1024x1024.webp`, alt: "Saved image" },
  { type: "image", src: `${IMG}/Amber-Interior-Design_Ambers-Montana-Extravaganza_Los-Angeles-California26-min.jpg`, alt: "Amber Interior Design — Montana residence" },
  { type: "image", src: `${IMG}/Amber-Interior-Design_Ambers-Montana-Extravaganza_Los-Angeles-California19-min.jpg`, alt: "Amber Interior Design — Montana residence" },
  { type: "image", src: `${IMG}/spentshell_1of1_1024x1024.webp`, alt: "Saved image" },
  { type: "image", src: `${IMG}/Mother-Anthropic-Claude-1-1024x782.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/e0f1f9f28e26c29091f24f988ae04dda.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/28782e78cc9a5be0e3a3fc2e60cc2c4a.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/91d87fb47a03ec823581df7bfc57c016.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/54eeba6bd880cdef5c929f81e9d1dabe.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/97304507b96ec7f543bbeb3bc921a4bd.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/9a70e05d5eb71c0f5ef1b1fb809caa63.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/3de354ced8e2a3d114a0a52c59ec1b77.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/d0137da3-eab2-4e1f-bd34-f792d5d70c79.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/bfc565edf2b0a014efe4de6426e3693c.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/a6c6c601ae5b970bf9f72dc15037d5c4.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/1edb5131e8fd1bc47131530d0ea248e3.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/86562e87-3527-4e28-8aa8-f1cbff84abca.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/d2a3bdfa903a58ac10373847b19009ae.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/Caps-21043_1024x1024.webp`, alt: "Saved image" },
  { type: "image", src: `${IMG}/15571ced-e01a-4567-b0f9-eb467cb97990.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/394cb8ef0b114402d2de4f3ebadd2ae2.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/94ecf2c9ea7aab2a891761a360c0709d.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/bcfb5e89194e0adb04a65b9d1c655871.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/4bffbe2a2b01be3c30f55b1263792280.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/a7fc33db2a028cd81e5c035cd3e0ef01.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/57c859417f8c212fddcb997ded9a9dfc.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/1b273aa715ba9ae81e8f48c1986784c1.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/1e8252b0f99ebd6c2a990d7d4ce7505d.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/4ac55061d43e1d64c1eafa66a821ef71.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/Caps-27502_1024x1024.webp`, alt: "Saved image" },
  { type: "image", src: `${IMG}/b4e58d5b17dbf33b4ec3f5dcebb2b3e8.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/f6c4d195-0901-4818-ad3c-ffb70ae6a75b.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/41a37cfdebb54a017282afe31abae60b.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/c8c4c24738c376539c4184e00cab4442.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/Amber-Interior-Design_Ambers-Montana-Extravaganza_Los-Angeles-California25-min.jpg`, alt: "Amber Interior Design — Montana residence" },
  { type: "image", src: `${IMG}/e157431f340d9b1d6d5a29a650916040.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/479a58ae-17f1-40ef-b296-ee528b407233.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/03fd5da42f618fb39b7a0e846c5dfeae.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/images.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/a75115614cffb3213935bb37d1b83621.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/fe526a4cecc438a342de4327fcb4f288.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/Signing_8_a34e60e6-558c-4f5e-8daf-0c6f284e6347.webp`, alt: "Saved image" },
  { type: "image", src: `${IMG}/ee85c61fcfc6d5a15b2e4ddee0585208.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/584fc53a5b05b56ea1092f7d359327a4.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/bfce427d23c3002e64bb5748fa3d9adf.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/download.png`, alt: "Saved image" },
  { type: "image", src: `${IMG}/cef11ea0-6dbc-4f36-9db7-a9da50cb15f3.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/ba2560e00b1b6c3cf2ca6a9ae117ab68.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/68ab38fa-e525-4cac-a2b7-8d0e7648a837.jpeg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/635e52d7ab29fe6080d046e927f2d642.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/f214c5cc38ce295cd876dee36991902c.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/our-process-desktop.webp`, alt: "Saved image" },
  { type: "image", src: `${IMG}/1a59d9887d41cd201527e25a499ba8cb.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/Walden-Retreats-11-1440x960.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/cd76d2492761d85aef0f01f23c4c01db.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/27dd6a529d6d016bbc177cb817c53b7e.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/bef2647a6cc19e2a485d31b5cb306a6d.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/eda6a5532c77ca89b1c3552f504709d3.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/2ed8c25634c6c12a5e857f3263af65a6.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/3b335b7edc5491b89f6bdc3befacfe9b.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/649e10353aeb4123df1d9cc8094b6b5f.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/7fdc659728570d5b823fd593d81642f5.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/8732203a185ce8ec1469bd971ebd2fe3.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/16b38d71c322493af16d8ced5d8c30ee.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/300baf0ca82737d9fe7a9556fcdd508a.jpg`, alt: "Saved image" },
  { type: "image", src: `${IMG}/d765cc2080a95c0ce787a33394aca7b9.jpg`, alt: "Saved image" },
];
