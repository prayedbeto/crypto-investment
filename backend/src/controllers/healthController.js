const getHealth = async (req, res) => {
  try {
    res.json({ 
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString(),
      status: 'OK',
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Error en health check:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      status: 'ERROR'
    });
  }
};

module.exports = {
  getHealth
}; 