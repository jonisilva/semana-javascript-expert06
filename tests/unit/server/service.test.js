import { 
    jest, 
    expect,
    describe,
    test,
    beforeEach
} from '@jest/globals'
import config from '../../../server/config.js'
import TestUtil from '../util/testUtil.js'
import { Service } from '../../../server/service.js'
import fs from 'fs'
import fsPromises from 'fs/promises'
import { join, extname } from 'path'

const {
    dir
} = config

describe('#Service - test suite for Service', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    test('#createFileStream', async () => {
        const mockFilename = 'test.mp3'
        const mockFileStream = TestUtil.generateReadableStream(['data'])
        
        jest.spyOn(
            fs,
            fs.createReadStream.name,
        ).mockReturnValue(mockFileStream)
        
        const service = new Service()
        const result = await service.createFileStream(mockFilename)

        expect(fs.createReadStream).toBeCalledWith(mockFilename)
        expect(result).toStrictEqual(mockFileStream)
    })

    test('#getFileInfo', async () => {
        const mockFilename = 'test.mp3'
        const fullFilePath = join(dir.publicDirectory, mockFilename)
        const expectedResult  = {
            name: fullFilePath,
            type: '.mp3'
        }

        jest.spyOn(
            fsPromises,
            fsPromises.access.name,
        ).mockReturnValue()

        const service = new Service()
        const result = await service.getFileInfo(mockFilename)
        
        expect(fsPromises.access).toBeCalled()
        expect(result).toStrictEqual(expectedResult)
    })

    test('#getFileStream', async () => {
        const mockFilename = 'test.mp3'
        const mockFileType = '.mp3'
        const createFileStreamResult = TestUtil.generateReadableStream(['data'])
        const fullFilePath = join(dir.publicDirectory, mockFilename)
        const getFileInfoResult  = {
            name: fullFilePath,
            type: mockFileType
        }

        const expectedResult  = {
            stream: createFileStreamResult,
            type: mockFileType
        }

        const service = new Service()
        jest.spyOn(
            service,
            service.createFileStream.name,
        ).mockReturnValue(createFileStreamResult)

        jest.spyOn(
            service,
            service.getFileInfo.name,
        ).mockReturnValue(getFileInfoResult)

        const result = await service.getFileStream(mockFilename)

        expect(service.createFileStream).toHaveBeenLastCalledWith(fullFilePath)
        expect(service.getFileInfo).toHaveBeenLastCalledWith(mockFilename)
        expect(result).toStrictEqual(expectedResult)
    })
})