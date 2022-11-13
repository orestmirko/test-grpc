import { TicketTierEntity } from '@entities';
import { TicketTierStatusEnum } from '@enums';
import { BadRequestException, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TicketTierController } from './ticket-tier.controller';
import { TicketTierService } from './ticket-tier.service';

describe('TicketTier Controller', () => {
  let ticketTierController: TicketTierController;
  let ticketTierService: TicketTierService;
  let logger: Logger;

  const ticketTierId = '7fce8d53-8de9-43a1-98d3-d742aaa1ac69';

  let ticketTier = new TicketTierEntity();
  const ticketTierData = {
    sale_start: new Date('2023-11-13T08:55:38.566Z'),
    sale_end: new Date('2024-11-13T08:55:38.566Z'),
    id: ticketTierId,
    status: TicketTierStatusEnum.inactive,
  };

  ticketTier = ticketTierData;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TicketTierController],
      providers: [
        TicketTierService,
        { provide: Logger, useValue: { log: jest.fn() } },
        {
          provide: getRepositoryToken(TicketTierEntity),
          useValue: { findOne: jest.fn().mockResolvedValue(ticketTier) },
        },
      ],
    }).compile();

    ticketTierService = moduleRef.get<TicketTierService>(TicketTierService);
    ticketTierController = moduleRef.get<TicketTierController>(
      TicketTierController,
    );
    logger = moduleRef.get<Logger>(Logger);
  });

  describe('GET ticker-tier/:id', () => {
    it('Should return ticketTier item', async () => {
      jest.spyOn(ticketTierService, 'getById').mockResolvedValue(ticketTier);
      expect(await ticketTierController.getById(ticketTierId)).toBe(ticketTier);
    });
  });

  describe('POST /ticker-tier', async () => {
    it('Create new ticket tier', async () => {
      const ticketTierRepositoryCreateSpy = jest
        .spyOn(ticketTierService, 'create')
        .mockResolvedValue(ticketTier);

      const result = await ticketTierService.create(ticketTierData);

      expect(ticketTierRepositoryCreateSpy).toBeCalledWith(ticketTierData);
      expect(result).toEqual(ticketTier);
    });

    it('Should throw BadRequest error if sale_start < current time', () => {
      const body = {
        sale_start: new Date('2022-11-13T08:55:38.566Z'),
        sale_end: new Date('2024-11-13T08:55:38.566Z'),
      };

      const currentDateObject = new Date('2023-11-13T08:55:38.566Z');

      const checkSaleStartTimeFrames = () => {
        if (body.sale_start < currentDateObject) {
          throw new BadRequestException(
            'sale_start to be greater than current time',
          );
        }
      };
      expect(checkSaleStartTimeFrames).toThrow(BadRequestException);
      expect(checkSaleStartTimeFrames).toThrow(
        'sale_start to be greater than current time',
      );
    });

    it('Should throw BadRequest error if sale_start > sale_end', () => {
      const body = {
        sale_start: new Date('2023-11-13T08:55:38.566Z'),
        sale_end: new Date('2022-11-13T08:55:38.566Z'),
      };

      const checkSaleTimeFrames = () => {
        if (body.sale_start > body.sale_end) {
          throw new BadRequestException(
            'sale_end to be greater than sale_start',
          );
        }
      };
      expect(checkSaleTimeFrames).toThrow(BadRequestException);
      expect(checkSaleTimeFrames).toThrow(
        'sale_end to be greater than sale_start',
      );
    });
  });
});
