import { Test, TestingModule } from '@nestjs/testing';
import { SaveImageService } from './save-image.service';

describe('SaveImageService', () => {
  let service: SaveImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaveImageService],
    }).compile();

    service = module.get<SaveImageService>(SaveImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
