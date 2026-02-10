import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './department.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let prisma: {
    department: {
      findMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      department: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('searchByName returns empty array for blank query', async () => {
    const result = await service.searchByName('   ');
    expect(result).toEqual([]);
    expect(prisma.department.findMany).not.toHaveBeenCalled();
  });

  it('searchByName performs case-insensitive contains search', async () => {
    prisma.department.findMany.mockResolvedValueOnce([
      { id: 'd1', name: 'Engineering' },
    ]);

    const result = await service.searchByName('eng');

    expect(prisma.department.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: 'eng',
          mode: 'insensitive',
        },
      },
    });
    expect(result).toEqual([{ id: 'd1', name: 'Engineering' }]);
  });
});
