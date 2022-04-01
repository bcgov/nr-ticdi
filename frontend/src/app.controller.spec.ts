import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HttpConsumingService } from './app.service.ttls'
import { HttpModule} from '@nestjs/axios'


describe('AppController', () => {
  let app: TestingModule
  let httpConsumingService: HttpConsumingService

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [HttpModule ],
      controllers: [AppController],
      providers: [AppService, HttpConsumingService]
    }).compile()

  httpConsumingService = app.get<HttpConsumingService>(HttpConsumingService)

  })

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<AppController>(AppController)
      expect(appController.getHello()).toBe('Hello World!')
    })
  })

})