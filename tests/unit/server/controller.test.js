import { 
    jest, 
    expect,
    describe,
    test,
    beforeEach
} from '@jest/globals'
import config from '../../../server/config.js'
import { handler } from '../../../server/routes.js'
import TestUtil from '../util/testUtil.js'
import { Controller } from '../../../server/controller.js'
import { Service } from '../../../server/service.js'

const {
    pages,
    location,
    constants: {
        CONTENT_TYPE
    }
} = config

describe('#Controller - test suite for controller', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    test('getFileStream - should return filestream', async () => {
        const mockFilename = 'test.html'
        const mockType = '.html'
        const mockFileStream = TestUtil.generateReadableStream(['data'])
        const mockFileObject = {
            stream: mockFileStream,
            type: mockType
        }
        jest.spyOn(
            Service.prototype,
            Service.prototype.getFileStream.name,
        ).mockResolvedValue(mockFileObject)

        const controller = new Controller()
        // one way
        const result = await controller.getFileStream(mockFilename)
        expect(result).toStrictEqual(mockFileObject)

        // other way
        const {
        stream,
        type
        } = result
        expect(stream).toStrictEqual(mockFileStream)
        expect(type).toStrictEqual(mockType)

    })
})