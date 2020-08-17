import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = this.ormRepository.findOne({
      where: { name },
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const findProducts = await this.ormRepository.find({
      where: {
        id: In(
          products.map(product => {
            return product.id;
          }),
        ),
      },
    });

    return findProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const findProducts = await this.ormRepository.find({
      where: {
        id: In(
          products.map(product => {
            return product.id;
          }),
        ),
      },
    });

    const productsUpdate = findProducts.map(product => {
      const productUpdate = products.find(
        productData => productData.id === product.id,
      );

      return { ...productUpdate, quantity: productUpdate?.quantity };
    });

    const productsSave = await this.ormRepository.save(productsUpdate);

    return productsSave;
  }
}

export default ProductsRepository;
