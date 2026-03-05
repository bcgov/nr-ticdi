import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, CanActivate, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { ProvisionController } from './provision.controller';
import { ProvisionService } from './provision.service';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const mockIdirUser = {
  idir_username: 'TEST_USER',
  given_name: 'Test',
  family_name: 'User',
  email: 'test@gov.bc.ca',
};

const allowAll: CanActivate = { canActivate: () => true };

const rejectUnauthorized: CanActivate = {
  canActivate: () => {
    throw new UnauthorizedException('No valid JWT');
  },
};

const mockProvisionService = {
  create: jest.fn(),
  findAll: jest.fn(),
  getProvisionInfo: jest.fn(),
  findAllVariables: jest.fn(),
  findVariablesByDocType: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  addVariable: jest.fn(),
  updateVariable: jest.fn(),
  removeVariable: jest.fn(),
  findById: jest.fn(),
  enable: jest.fn(),
  disable: jest.fn(),
  getMandatoryProvisionsByDocumentTypeId: jest.fn(),
  getManageDocTypeProvisions: jest.fn(),
  associateDocType: jest.fn(),
  disassociateDocType: jest.fn(),
  updateManageDocTypeProvisions: jest.fn(),
};

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

async function buildApp(authGuard: CanActivate = allowAll): Promise<INestApplication> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    controllers: [ProvisionController],
    providers: [{ provide: ProvisionService, useValue: mockProvisionService }],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue(authGuard)
    .compile();

  const app = moduleRef.createNestApplication();
  app.use((req, _res, next) => {
    req.user = mockIdirUser;
    next();
  });
  await app.init();
  return app;
}

// ---------------------------------------------------------------------------
// Guard enforcement
// ---------------------------------------------------------------------------

describe('ProvisionController – guard enforcement', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 401 when JwtAuthGuard rejects', async () => {
    const app = await buildApp(rejectUnauthorized);
    await request(app.getHttpServer()).get('/provision').expect(401);
    await app.close();
  });
});

// ---------------------------------------------------------------------------
// Controller logic
// ---------------------------------------------------------------------------

describe('ProvisionController – controller logic', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  describe('GET /provision', () => {
    it('returns all provisions', async () => {
      const provisions = [{ id: 1, provision_name: 'Prov A' }];
      mockProvisionService.findAll.mockResolvedValue(provisions);

      const res = await request(app.getHttpServer()).get('/provision').expect(200);
      expect(res.body).toEqual(provisions);
    });
  });

  describe('GET /provision/variables', () => {
    it('returns all variables', async () => {
      const vars = [{ id: 1, variable_name: 'VAR_A' }];
      mockProvisionService.findAllVariables.mockResolvedValue(vars);

      const res = await request(app.getHttpServer()).get('/provision/variables').expect(200);
      expect(res.body).toEqual(vars);
    });
  });

  describe('GET /provision/variables-by-doc-type/:document_type_id', () => {
    it('calls findVariablesByDocType with coerced numeric id', async () => {
      mockProvisionService.findVariablesByDocType.mockResolvedValue([]);

      await request(app.getHttpServer()).get('/provision/variables-by-doc-type/5').expect(200);
      expect(mockProvisionService.findVariablesByDocType).toHaveBeenCalledWith(5);
    });
  });

  describe('GET /provision/get-provision-info/:provision_id', () => {
    it('returns provision info for the given id', async () => {
      const info = { id: 3, provision_name: 'Info Prov' };
      mockProvisionService.getProvisionInfo.mockResolvedValue(info);

      const res = await request(app.getHttpServer()).get('/provision/get-provision-info/3').expect(200);
      expect(res.body).toEqual(info);
      expect(mockProvisionService.getProvisionInfo).toHaveBeenCalledWith('3');
    });
  });

  describe('GET /provision/remove/:id', () => {
    it('calls remove with the correct id', async () => {
      mockProvisionService.remove.mockResolvedValue({ affected: 1 });

      await request(app.getHttpServer()).get('/provision/remove/7').expect(200);
      expect(mockProvisionService.remove).toHaveBeenCalledWith('7');
    });
  });

  describe('GET /provision/remove-variable/:id', () => {
    it('calls removeVariable with the correct id', async () => {
      mockProvisionService.removeVariable.mockResolvedValue({ affected: 1 });

      await request(app.getHttpServer()).get('/provision/remove-variable/9').expect(200);
      expect(mockProvisionService.removeVariable).toHaveBeenCalledWith('9');
    });
  });

  describe('GET /provision/enable/:id', () => {
    it('calls enable with the correct id', async () => {
      mockProvisionService.enable.mockResolvedValue({ affected: 1 });

      await request(app.getHttpServer()).get('/provision/enable/2').expect(200);
      expect(mockProvisionService.enable).toHaveBeenCalledWith('2');
    });
  });

  describe('GET /provision/disable/:id', () => {
    it('calls disable with the correct id', async () => {
      mockProvisionService.disable.mockResolvedValue({ affected: 1 });

      await request(app.getHttpServer()).get('/provision/disable/2').expect(200);
      expect(mockProvisionService.disable).toHaveBeenCalledWith('2');
    });
  });

  describe('GET /provision/get-all-mandatory-provisions/:id', () => {
    it('calls getMandatoryProvisionsByDocumentTypeId with the correct id', async () => {
      mockProvisionService.getMandatoryProvisionsByDocumentTypeId.mockResolvedValue([]);

      await request(app.getHttpServer()).get('/provision/get-all-mandatory-provisions/4').expect(200);
      expect(mockProvisionService.getMandatoryProvisionsByDocumentTypeId).toHaveBeenCalledWith('4');
    });
  });

  describe('GET /provision/get-manage-doc-type-provisions/:id', () => {
    it('returns manage doc type provisions', async () => {
      const provisions = [{ id: 1, associated: true }];
      mockProvisionService.getManageDocTypeProvisions.mockResolvedValue(provisions);

      const res = await request(app.getHttpServer()).get('/provision/get-manage-doc-type-provisions/1').expect(200);
      expect(res.body).toEqual(provisions);
    });
  });

  describe('GET /provision/associate-doc-type/:provision_id/:document_type_id', () => {
    it('calls associateDocType with correct params', async () => {
      mockProvisionService.associateDocType.mockResolvedValue({ id: 1 });

      await request(app.getHttpServer()).get('/provision/associate-doc-type/3/1').expect(200);
      expect(mockProvisionService.associateDocType).toHaveBeenCalledWith('3', '1');
    });
  });

  describe('GET /provision/disassociate-doc-type/:provision_id/:document_type_id', () => {
    it('calls disassociateDocType with coerced provision_id', async () => {
      mockProvisionService.disassociateDocType.mockResolvedValue({ affected: 1 });

      await request(app.getHttpServer()).get('/provision/disassociate-doc-type/3/1').expect(200);
      expect(mockProvisionService.disassociateDocType).toHaveBeenCalledWith(3, '1');
    });
  });

  describe('POST /provision', () => {
    it('creates a provision via provisionService.create', async () => {
      const dto = { provision_name: 'New Prov', free_text: '', help_text: '', category: 'A', type: 'M' };
      mockProvisionService.create.mockResolvedValue({ id: 99, ...dto });

      const res = await request(app.getHttpServer()).post('/provision').send(dto).expect(201);
      expect(res.body.id).toBe(99);
    });
  });

  describe('POST /provision/add', () => {
    it('appends idir_username from token and calls create', async () => {
      mockProvisionService.create.mockResolvedValue({ id: 50 });

      const payload = { provision: 'Prov B', free_text: 'ft', help_text: 'ht', category: 'B' };
      await request(app.getHttpServer()).post('/provision/add').send(payload).expect(201);

      expect(mockProvisionService.create).toHaveBeenCalledWith({
        ...payload,
        create_userid: mockIdirUser.idir_username,
      });
    });
  });

  describe('POST /provision/update', () => {
    it('appends idir_username and calls update with the correct id', async () => {
      mockProvisionService.update.mockResolvedValue({ id: 5 });

      const payload = { id: 5, provision: 'Updated', free_text: '', list_items: [], help_text: '', category: 'C' };
      await request(app.getHttpServer()).post('/provision/update').send(payload).expect(201);

      const { id, ...rest } = payload;
      expect(mockProvisionService.update).toHaveBeenCalledWith(id, {
        ...rest,
        update_userid: mockIdirUser.idir_username,
      });
    });
  });

  describe('POST /provision/add-variable', () => {
    it('appends idir_username and calls addVariable', async () => {
      mockProvisionService.addVariable.mockResolvedValue({ id: 20 });

      const payload = { variable_name: 'VAR', variable_value: 'val', help_text: '', provision_id: 1 };
      await request(app.getHttpServer()).post('/provision/add-variable').send(payload).expect(201);

      expect(mockProvisionService.addVariable).toHaveBeenCalledWith({
        ...payload,
        create_userid: mockIdirUser.idir_username,
      });
    });
  });

  describe('POST /provision/update-variable', () => {
    it('appends idir_username and calls updateVariable', async () => {
      mockProvisionService.updateVariable.mockResolvedValue({ id: 21 });

      const payload = { id: 21, variable_name: 'VAR2', variable_value: 'v2', help_text: '', provision_id: 1 };
      await request(app.getHttpServer()).post('/provision/update-variable').send(payload).expect(201);

      expect(mockProvisionService.updateVariable).toHaveBeenCalledWith({
        ...payload,
        update_userid: mockIdirUser.idir_username,
      });
    });
  });

  describe('POST /provision/update-manage-doc-type-provisions', () => {
    it('calls updateManageDocTypeProvisions with correct data', async () => {
      mockProvisionService.updateManageDocTypeProvisions.mockResolvedValue([]);

      const payload = { document_type_id: 1, provisions: [] };
      await request(app.getHttpServer()).post('/provision/update-manage-doc-type-provisions').send(payload).expect(201);

      expect(mockProvisionService.updateManageDocTypeProvisions).toHaveBeenCalledWith(
        payload.document_type_id,
        payload.provisions
      );
    });
  });
});
