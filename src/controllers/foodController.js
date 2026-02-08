import * as Foodmodel from "../models/foodModel.js";

export const getAll = async (req, res) => {
  try {
    // Validação de filtros //! Funciona...

    const filters = {};

    if (req.query.name) filters.name = req.query.name;
    if (req.query.description) filters.description = req.query.description;
    if (req.query.price) filters.price = req.query.price;
    if (req.query.category) filters.category = req.query.category;
    if (req.query.available !== undefined)
      filters.available = req.query.available === "true";

    const foods = await Foodmodel.findAll(filters);

    if (!foods || foods.length === 0) {
      return res.status(200).json({
        message: "Nenhum registro encontrado.",
      });
    }
    res.json(foods);
  } catch (error) {
    console.error("Erro ao buscar food:", error);
    res.status(500).json({ error: "Erro ao buscar registros de foods" });
  }
};

export const create = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Corpo da requisição vazio. Envie os dados da comida!",
      });
    }

    const { name, description, price, category, available } = req.body;

    if (!name)
      return res.status(400).json({ error: "O nome (name) é obrigatório!" });
    if (!description)
      return res
        .status(400)
        .json({ error: "A descrição (description) é obrigatória!" });
    if (!price && price !== 0)
      return res.status(400).json({ error: "O preço (price) é obrigatório!" });
    if (isNaN(price) || parseFloat(price) <= 0)
      return res
        .status(400)
        .json({ error: "O preço deve ser um número positivo!" });
    if (!category)
      return res
        .status(400)
        .json({ error: "A categoria (category) é obrigatória!" });

    const categoriasValidas = [
      "entrada",
      "prato principal",
      "sobremesa",
      "bebida",
    ];
    if (!categoriasValidas.includes(category.toLowerCase())) {
      return res
        .status(400)
        .json({
          error: `Categoria inválida. Use: ${categoriasValidas.join(", ")}`,
        });
    }

    const data = await Foodmodel.create({
      name,
      description,
      price: parseFloat(price),
      category,
      available:
        available === undefined
          ? true
          : available === "true" || available === true,
    });

    res.status(201).json({
      message: "Registro cadastrado com sucesso!",
      data,
    });
  } catch (error) {
    console.error("Erro ao criar food:", error);
    res
      .status(500)
      .json({ error: "Erro interno no servidor ao salvar o registro." });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "O ID enviado não é um número válido." });
    }

    const data = await Foodmodel.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Registro não encontrado." });
    }
    res.json({ data });
  } catch (error) {
    console.error("Erro ao buscar food:", error);
    res.status(500).json({ error: "Erro ao buscar registro de food" });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Corpo da requisição vazio. Envie os dados da comida!",
      });
    }

    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    const exists = await Foodmodel.findById(id);
    if (!exists) {
      return res
        .status(404)
        .json({ error: "Registro não encontrado para atualizar." });
    }

    //! Verificar body pra nao dar b.o: só aceitar campos válidos para update
    const { name, description, price, category, available } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) {
      if (isNaN(price) || parseFloat(price) <= 0) {
        return res
          .status(400)
          .json({ error: "O preço deve ser um número positivo!" });
      }
      updateData.price = parseFloat(price);
    }
    if (category !== undefined) {
      const categoriasValidas = [
        "entrada",
        "prato principal",
        "sobremesa",
        "bebida",
      ];
      if (!categoriasValidas.includes(category.toLowerCase())) {
        return res
          .status(400)
          .json({
            error: `Categoria inválida. Use: ${categoriasValidas.join(", ")}`,
          });
      }
      updateData.category = category;
    }
    if (available !== undefined) {
      updateData.available = available === "true" || available === true;
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ error: "Nenhum campo válido enviado para atualização." });
    }

    const data = await Foodmodel.update(id, updateData);
    res.json({
      message: `O registro "${data.name}" foi atualizado com sucesso!`,
      data,
    });
  } catch (error) {
    console.error("Erro ao atualizar food:", error);
    res.status(500).json({ error: "Erro ao atualizar registro de food" });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    const exists = await Foodmodel.findById(id);
    if (!exists) {
      return res
        .status(404)
        .json({ error: "Registro não encontrado para deletar." });
    }

    await Foodmodel.remove(id);
    res.json({
      message: `O registro "${exists.name}" foi deletado com sucesso!`,
      deletado: exists,
    });
  } catch (error) {
    console.error("Erro ao deletar food:", error);
    res.status(500).json({ error: "Erro ao deletar registro de food" });
  }
};
