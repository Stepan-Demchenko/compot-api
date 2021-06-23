// import { getFileCreationTimestamp, getFileName } from './file-upload.utils';
//
// jest.mock('../../src/utils/file-upload.utils', () => ({
//   ...jest.requireActual('../../src/utils/file-upload.utils'),
//   getFileCreationTimestamp: jest.fn(),
// }));
//
// describe('file-upload.utils', () => {
//   describe('getFileName', () => {
//     it('should extend original file name and extension with date timestamp', function () {
//       const mockFileInfo = {
//         fieldname: 'categoryImage',
//         originalname: 'burger.jpg',
//         encoding: '7bit',
//         mimetype: 'image/jpeg',
//       };
//       const mockCallbackFn = jest.fn();
//
//       const result = getFileName({}, mockFileInfo, mockCallbackFn);
//       const mockTimeStamp = Date.now();
//       (getFileCreationTimestamp as any).mockReturnValueOnce(mockTimeStamp);
//       expect(mockCallbackFn).toHaveBeenCalledWith(null, `burger-${mockTimeStamp}.jpg`);
//     });
//   });
// });
